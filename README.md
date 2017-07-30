"#jqueryPluginGraph" 

EXAMPLE USAGE

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

	//var lineTest = $("#drawBoard").KmGraphs(yAxis, xAxis, myData, options).drawBarGraph(); 
 	 
 	 
});


