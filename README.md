# bindstyle-ember-helper

A [Handlebars](http://handlebarsjs.com) helper for [Ember](http://emberjs.com) which allows you to bind style properties in your templates. 

## Requirements

Ember.js 1.3.0+

## Usage

{{bind-style}} is based on Ember's built-in {{bind-attr}} and works similarly, except that you pass CSS name-value pairs, rather than attribute name-value pairs. There is currently no support for static styles, but you really shouldn't be using static inline styles anyways. Put those in your style sheet!


Imagine a view that contains the width of a bar in your bar-chart:

```javascript
App.MyBarChart = Ember.View.extend({
  barWidth: 200
});
```

And a template that binds it to the CSS width of an element:

```html
<div class="bar" {{bind-style width="barWidth"}}></div>
```

The resulting HTML will be:

```html
<div class="bar" style="width:200px"></div>
```

Note: In this case, since `barWidth` evaluates to a number, and the CSS `width` property takes a length value, `px` is automatically added to the value. Unit expansion works in exactly the same way as jQuery's `css` method (in fact it uses the same underlying jQuery methods).

---

Please be aware: You **can not** use both {{bind-style}} with {{bind-attr style=...}} in a single element. Duplicate attribute declarations are not allowed in HTML.
