# bindStyle-ember-helper

A very simple handlebar helper for [ember.js](http://emberjs.com) which allow you to bind style properties in your templates. 

## Requirements

Ember.js

## Usage
---
{{bindStyle}} is based on ember {{bindAttr}} and works pretty much the same way.


Imagine a view that contains the width of a bar in your bar-chart.

```javascript
App.MyBarChart = Ember.View.extend({
	barWidth: 200;
});
```

In your handlebars template you will then do  

```html
<div class="bar" {{bindStyle width="barWidth" width-unit="px"}}></div> 
```

You must define the unit for the value to be used. There are 2 ways to define units.  

Global unit   

```html
<div class="bar" {{bindStyle unit="px" width="barWidth" height="barHeight"}}></div> 
```   

Specific unit    

```html
<div class="bar" {{bindStyle width="barWidth" width-unit="px" height="barHeight" height-unit="%"}}></div> 
```    

If you define a global unit and specific units. The specific unit take precedence over the global when defined.

That's it
