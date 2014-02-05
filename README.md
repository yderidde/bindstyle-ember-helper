# bindStyle-ember-helper

A very simple handlebar helper for [ember.js](http://emberjs.com) which allow you to bind style properties in your templates. 

## Requirements

Ember.js 1.3.0+

## Usage
---
{{bind-style}} is based on ember {{bind-attr}} and works similarly.


Imagine a view that contains the width of a bar in your bar-chart.

```javascript
App.MyBarChart = Ember.View.extend({
  barWidth: 200
});
```

In your handlebars template you will then do  

```html
<div class="bar" {{bind-style width="barWidth"}}></div> 
```

In this case, since `barWidth` evaluates to a number, and the CSS `width` property takes a length value, `px` is automatically added to the value. Thus the resulting HTML will be:

```html
<div class="bar" style="width:200px"></div>
```

Note: Unit expansion works in exactly the same way as jQuery's `css` method (in fact it uses the same underlying code).

