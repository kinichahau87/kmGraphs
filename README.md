Jquery Graph Plugin
=============================

A simple easy to use graph library

## Usage

include it along with the latest jquery version

```
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="./jqueryGraphs.js"></script>

```

```javascript

$(function(){ 	
 	var myData = [25, 75, 50, 5, 31];
 	var lineTest = $("#drawBoard").KmGraphs(null, null, myData).drawLineGraph();

});
```

## Parameters

kmGraphs(yAxis, xAxis, data, options)

### Y & X axis

you can specify axis labels, start-end points and increment ticks.

```javascript
var yAxis = {
		start: 0,
		end: 75	    
};
var xAxis = {
		start: 0,
		end: 5,
		labels: ["Jan", "Feb", "Mar", "Apr", "May"],
		inc: 1
};

```

### Options
avialable options are:

rectangleWidth in pixels
rectanglePadding in pixels
color
canvasWidth
canvasHeight

### data

can be a single list or a multi-dimensional list


```javascript

$(function(){

 	var yAxis = {
 	    start: 0,
 	    end: 75	    
 	};
 	var xAxis = {
 	    start: 0,
 	    end: 5,
 	    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
 	    inc: 1
 	};
 	var myData = [25, 75, 50, 5, 31];

 	var options = {canvasWidth:500,canvasHeight:500,dataPostfix:"%"};	 

 	var lineTest = $("#drawBoard").KmGraphs(yAxis, xAxis, myData, options).drawLineGraph();


});

```
