(function(){

var EmberHandlebars = Ember.Handlebars;

var fmt = Ember.String.fmt;
var handlebarsGet = EmberHandlebars.get, normalizePath = EmberHandlebars.normalizePath;
var forEach = Ember.ArrayPolyfills.forEach;

/**
 * `bind-style` helper.
 * 
 * Modelled off the `bind-attr` helper, this helper allows you to bind to several styles.
 */
EmberHandlebars.registerHelper('bind-style', function bindStyleHelper(options) {
  var styles = options.hash;

  Ember.assert("You must specify at least one hash argument to bind-style", !!Ember.keys(styles).length);

  var view = options.data.view;
  var ret = [];
  var ctx = this;

  // Generate a unique id for this element. This will be added as a
  // data attribute to the element so it can be looked up when
  // the bound property changes.
  var dataId = ++Ember.uuid;

  var styleNames = Ember.keys(styles);

  ret.push(' style="');

  // For each style passed, create an observer and emit the
  // current value of the property as a style.
  forEach.call(styleNames, function(styleName) {
    var path = styles[styleName],
        normalized;

    Ember.assert(fmt("You must provide an expression as the value of bound style. You specified: %@=%@", [styleName, path]), typeof path === 'string');

    normalized = normalizePath(ctx, path, options.data);

    var value = (path === 'this') ? normalized.root : handlebarsGet(ctx, path, options),
        type = Ember.typeOf(value);

    if (type === 'object') {
      value = ('' + value);
      type = 'string';
    }
    else if (type === 'number'  &&  isNaN(value)) {
      value = null;
      type = 'null';
    }

    Ember.assert(fmt("Style values must be numbers, strings or objects, not %@", [value]), value === null || value === undefined || type === 'number' || type === 'string');

    var observer;

    observer = function observer() {
      var result = handlebarsGet(ctx, path, options),
          resultType = Ember.typeOf(result);

      Ember.assert(fmt("Style values must be numbers, strings or objects, not %@", [result]), result === null || result === undefined || resultType === 'number' || resultType === 'string');

      var elem = view.$("[data-bindstyle-" + dataId + "='" + dataId + "']");

      // If we aren't able to find the element, it means the element
      // to which we were bound has been removed from the view.
      // In that case, we can assume the template has been re-rendered
      // and we need to clean up the observer.
      if (!elem || elem.length === 0) {
        Ember.removeObserver(normalized.root, normalized.path, observer);
        return;
      }

      if (result != null) {
        elem.css(styleName, result);
      }
    };

    // Add an observer to the view for when the property changes.
    // When the observer fires, find the element using the
    // unique data id and update the style to the new value.
    // Note: don't add observer when path is 'this' or path
    // is whole keyword e.g. {{#each x in list}} ... {{bind-style style="x"}}
    if (path !== 'this' && !(normalized.isKeyword && normalized.path === '' )) {
      view.registerObserver(normalized.root, normalized.path, observer);
    }

    if (value != null) {
      if (type === 'number'  &&  !(jQuery.cssNumber[jQuery.camelCase(styleName)])) {
        value += 'px';
      }

      value = Handlebars.Utils.escapeExpression(value);

      if (value) {
        ret.push(styleName, ':', value, ';');
      }
    }
  }, this);

  if (ret.length === 1) {
    // No styles, don't add an empty 'style' attr:
    ret.length = 0;
  }
  else {
    ret.push('"');
  }

  // Add the unique identifier
  // NOTE: We use all lower-case since Firefox has problems with mixed case in SVG
  ret.push(' data-bindstyle-', dataId, '="', dataId, '"');

  return new EmberHandlebars.SafeString(ret.join(''));
});

/**
 * 
 */
EmberHandlebars.registerHelper('bindStyle', function bindStyleHelper() {
  Ember.warn("The 'bindStyle' view helper is deprecated in favor of 'bind-style'");
  return EmberHandlebars.helpers['bind-style'].apply(this, arguments);
});

})();
