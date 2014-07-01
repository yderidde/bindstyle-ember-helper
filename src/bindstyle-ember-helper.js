Ember.Handlebars.registerHelper('bindStyle', function(options) {
  var fmt = Ember.String.fmt;
  var attrs = options.hash;

  Ember.assert("You must specify at least one hash argument to bindStyle", !!Ember.keys(attrs).length);

  var view = options.data.view;
  var ret = [];
  var style = [];
  var ctx = this;

  // Generate a unique id for this element. This will be added as a
  // data attribute to the element so it can be looked up when
  // the bound property changes.
  var dataId = ++Ember.uuid;

  var attrKeys = Ember.keys(attrs).filter(function(item, index, self) {
    return (item.indexOf("unit") == -1) && (item !== "static");
  });

  // For each attribute passed, create an observer and emit the
  // current value of the property as an attribute.
  attrKeys.forEach(function(attr) {
    var property = attrs[attr];

    Ember.assert(fmt("You must provide a String for a bound attribute, not %@", [property]), typeof property === 'string');

    var propertyUnit = attrs[attr+"-unit"] || attrs["unit"] || ''; 

    var normalized = Em.Handlebars.normalizePath(ctx, property, options.data);
    var value = (property === "this" ? normalized.root : Em.Handlebars.get(ctx, property, options));

    Ember.assert(fmt("Attributes must be numbers, strings or booleans, not %@", [value]), value == null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean');

    var observer, invoker;

    observer = function observer() {
      var result = Em.Handlebars.get(ctx, property, options);

      Ember.assert(fmt("Attributes must be numbers, strings or booleans, not %@", [result]), result == null || typeof result === 'number' || typeof result === 'string' || typeof result === 'boolean');

      var elem = view.$("[data-bindAttr-" + dataId + "='" + dataId + "']");

      // If we aren't able to find the element, it means the element
      // to which we were bound has been removed from the view.
      // In that case, we can assume the template has been re-rendered
      // and we need to clean up the observer.
      if (Ember.isNone(elem) || elem.length === 0) {
        Ember.removeObserver(ctx, property, invoker);
        return;
      }

      var currentValue = elem.css(attr);

      if (currentValue !== result) {
        elem.css(attr, result+""+propertyUnit);
      }
    };

    invoker = function() {
      Ember.run.once(observer);
    };

    // Add an observer to the view for when the property changes.
    // When the observer fires, find the element using the
    // unique data id and update the attribute to the new value.
    if (property !== "this" && !(normalized.root && normalized.path === "")) {
      view.registerObserver(normalized.root, normalized.path, observer);
    }

    style.push(attr+':'+value+propertyUnit+';'+(attrs["static"] || ''));
  }, this);

  // Add the unique identifier
  ret.push('style="' + style.join(' ') + '" data-bindAttr-' + dataId + '="' + dataId + '"');
  return new Ember.Handlebars.SafeString(ret.join(' '));
});
