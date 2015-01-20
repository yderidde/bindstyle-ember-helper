(function() {
    Ember.Handlebars.registerHelper('bind-style', bindStyleHelper);

    Ember.Handlebars.registerHelper('bindStyle', function() {
        Em.warn("The 'bindStyle' view helper is deprecated in favor of 'bind-style'");
        return bindStyleHelper.apply(this, arguments);
    });

    function bindStyleHelper(options) {
        var fmt = Ember.String.fmt;
        var attrs = options.hash;

        Ember.assert("You must specify at least one hash argument to bindStyle", !!Ember.keys(attrs).length);

        var view = options.data.view;
        var ret = [];
        var style = [];

        // Generate a unique id for this element. This will be added as a
        // data attribute to the element so it can be looked up when
        // the bound property changes.
        var dataId = Ember.uuid();

        var attrKeys = Ember.keys(attrs).filter(function(item, index, self) {
            return (item.indexOf("unit") == -1) && (item !== "static");
        });

        // For each attribute passed, create an observer and emit the
        // current value of the property as an attribute.
        attrKeys.forEach(function(attr) {
              var property = attrs[attr];

              Ember.assert(fmt("You must provide an expression as the value of bound attribute." +
                             " You specified: %@=%@", [attr, property]), typeof property === 'string');

              var propertyUnit = attrs[attr+"-unit"] || attrs["unit"] || '';

              var lazyValue = view.getStream(property);
              var value = lazyValue.value();

              Ember.assert(fmt("Attributes must be numbers, strings or booleans, not %@", [value]), value == null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean');

              lazyValue.subscribe(view._wrapAsScheduled(function applyAttributeBindings() {
                  var result = lazyValue.value();

                  Ember.assert(fmt("Attributes must be numbers, strings or booleans, not %@", [result]),
                               result === null || result === undefined || typeof result === 'number' ||
                                 typeof result === 'string' || typeof result === 'boolean');

                  var elem = view.$("[data-bindattr-" + dataId + "='" + dataId + "']");

                  Ember.assert("An style binding was triggered when the element was not in the DOM", elem && elem.length !== 0);

                  elem.css(attr, result + "" + propertyUnit);
              }));

              if (attr === 'background-image' && typeof value === 'string' && value.substr(0, 4) !== 'url(') {
                  value = 'url(' + value + ')';
              }

              style.push(attr+':'+value+propertyUnit+';'+(attrs["static"] || ''));
        }, this);

        // Add the unique identifier
        ret.push('style="' + style.join(' ') + '" data-bindAttr-' + dataId + '="' + dataId + '"');
        return new Ember.Handlebars.SafeString(ret.join(' '));
    }
})();