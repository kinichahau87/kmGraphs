/**
 *  yAxis = {
 *   start,
 *   end,
 *   inc
 * }
 * xAxis = {
 *   start,
 *   end,
 *   labels,
 *   inc
 * }
 * 
 * options = {
 * 		rectangleWidth,
 * 		rectanglePadding,
 * 		color,
 * 		canvasWidth,
 * 		canvasHeight,
 * 		dataPrefix,
 * 		dataPostfix
 * }
 * 
 * 
 */


$.fn.KmGraphs = function (yDomain, xDomain, data, options) {

	var mGlobalThis = this;

	 function __gStandardDeviation (aDataSet){
		var mTotalSum = 0;
		//find the avg
		for (var key in aDataSet){
			if (aDataSet.hasOwnProperty(key)){
				mTotalSum = mTotalSum + aDataSet[key];
			}//end of if
		}//end of for

		var mNumAvg = mTotalSum / aDataSet.length;		
		//find difference in each avg
		var mSDiffTotal = 0;
		
		for (var key in aDataSet){
			if (aDataSet.hasOwnProperty(key)){
				mSDiffTotal = mSDiffTotal + Math.pow((aDataSet[key] - mNumAvg),2);
			}//end of if
		}//end of for
		
		var mSDiffAvg = mSDiffTotal / aDataSet.length;

		return Math.floor(Math.sqrt(mSDiffAvg));
		
	}//end of function
	
	function __gFindSmallest(aDataSet){
		var mSmallest = Math.pow(2,32) - 1;
		for (var i = 0; i < aDataSet.length; i++){
			if (aDataSet[i] < mSmallest){
				mSmallest = aDataSet[i];
			}// end of if
		}//end of for
		
		return mSmallest;
	}
	
	function __gFindBiggest(aDataSet){
		var mBiggest = Math.pow(-2, 31) - 1;
		for (var i = 0; i < aDataSet.length; i++){
			if (aDataSet[i] > mBiggest){
				mBiggest = aDataSet[i];
			}//end of if
		}//end of for	
		
		return mBiggest + yDomain.inc ;
	}

	
    //validating
    if (xDomain != null) {
        if (xDomain.end == undefined || xDomain.end == null) {
            throw new Error("Your parameter \"xDomain\" does not have the property \"end\".");
        }
    }    

    if (data.length != xDomain.end) {
        throw new Error("Your parameter \"data\" has eighter too many or not have enouch elements: ");
    }
	
	if (yDomain != null) {
        if (yDomain.inc == 0 || yDomain.inc == undefined) {
           yDomain.inc = __gStandardDeviation(data);
        }
		
		if (yDomain.start == undefined){
			yDomain.start = 0;
		}
		
		if (yDomain.end == undefined){
			yDomain.end = __gFindBiggest(data);
		}
    }
	
	//default graph settings
    var rectWidth = 35;
    var recLeft = 55;    
    var recPadding = 5;
    var numberofElements = xDomain.end / xDomain.inc;
    var numberOfTicks = yDomain.end / yDomain.inc;
    var color = "red";
    var canvasWidth = 900;
    var canvasHeight = 1000;
    var maxRectangleHeight = 0;
    var maxRectangleWidth = data.length * 45;
    var fontSizeRatio;
    var fontSize = 10;
    var fontDerv = 10;
    var heightRatio = 1;
    var widthRatio = 1;
    var wOperand = "*";
    var operand = "*";
    var recLeftOperand = "-";
	var graphBottom;
	var barOpacity = 0.75;
	var graphAllPadding = 15;
	var lineChartRadius = 4;
	var lineChartPointColor = "red";
	var defaultStrokeWidth = 1;
	
	//constants	
	var mCanvasWidthConst = 900;
	var mCanvasHeightConst = 1000;
	var mFontPercentRatioConst = 8;
	var mFontPaddingConst = 10;
	var mCanvasRatioPercentConst = 0.85;
	
	function prepareGraph(){
		 //calculate font sizes based on canvas area
		fontSizeRatio = (canvasWidth * canvasHeight) / (mCanvasWidthConst * mCanvasHeightConst);
		fontSize =  fontSize + (mFontPercentRatioConst * fontSizeRatio);
		fontDerv = (mFontPaddingConst - fontSize) / fontSize;
    
		//calculate max height    
		for (var l = 0; l < data.length; l++) {
			if (data[l] > maxRectangleHeight) {
				maxRectangleHeight = data[l];
			}
		}
		//convert width and height to ordinal numbers
    
		if (canvasHeight > maxRectangleHeight){
			heightRatio = (canvasHeight * mCanvasRatioPercentConst) / maxRectangleHeight;
		} else {
			operand = "/";
			heightRatio = maxRectangleHeight / (canvasHeight * mCanvasRatioPercentConst);
		}
    
		if (canvasWidth > maxRectangleWidth){
			widthRatio = (canvasWidth * mCanvasRatioPercentConst) / maxRectangleWidth;
		} else {
			wOperand = "/";
			recLeftOperand = "+";
			widthRatio = maxRectangleWidth  / (canvasWidth * mCanvasRatioPercentConst); 
		}

        
		graphBottom = canvasHeight - 5;
		rectWidth = eval(rectWidth + wOperand + widthRatio);
    
		$(mGlobalThis).append("<svg id=\"svgCanvas\" width=\"" + canvasWidth + "\" height=\"" + canvasHeight + "\"></svg>");

    //the the x axis
		var lineH = $(document.createElementNS("http://www.w3.org/2000/svg", "line")).attr({
			id: "lineHorizon",
			x1: recLeft - 20,
			y1: graphBottom - graphAllPadding,
			x2: (numberofElements * (rectWidth + 10)) + (numberofElements *recPadding) + 10,
			y2: graphBottom - graphAllPadding,
			style: "stroke:black;stroke-width:2"
		});

		$("#svgCanvas").append(lineH);
   
		
		
		//draw the y axis and the ticks
        recLeft = 35;
        
        var lineV = $(document.createElementNS("http://www.w3.org/2000/svg", "line")).attr({
            id: "lineVerizon",
            x1: recLeft + 5,
            y1: graphBottom,
            x2: recLeft + 5,
            y2: 10,
            style: "stroke:black;stroke-width:2"
        });

        $("#svgCanvas").append(lineV);
        
        var tickBottom = graphBottom - graphAllPadding;
        for (var j = yDomain.start; j <= numberOfTicks; j++) {
            var lineTick = $(document.createElementNS("http://www.w3.org/2000/svg", "line")).attr({
                id: "lineTick",
                x1: recLeft + 2,
                y1: tickBottom,
                x2: recLeft + 8,
                y2: tickBottom,
                style: "stroke:black;stroke-width:1"
            });
            var tickNumber = $(document.createElementNS("http://www.w3.org/2000/svg", "text")).attr({
                id: "label" + j,
                x: recLeft - graphAllPadding,
                y: tickBottom + 3,
                fill: "black",
                style:"font-size:" + fontSize
            });
            tickNumber.append(j * yDomain.inc);
            tickBottom = tickBottom - (yDomain.inc * heightRatio) ;
            $("#svgCanvas").append(lineTick);
            $("#svgCanvas").append(tickNumber);
        }//end of for
	}//end of function
	
	this.drawBarGraph = function(){
		
		//set option settings
    if (options != undefined || options != null) {
        if (options.rectangleWidth != undefined){
            rectWidth = options.rectangleWidth;
        }
        
        if (options.rectanglePadding != undefined){
            recPadding = options.rectanglePadding;
        }
        
        if (options.color != undefined){
            color = options.color;
        }
        
        if (options.canvasWidth != undefined){
            canvasWidth = options.canvasWidth;
        }
        
        if (options.canvasHeight != undefined){
            canvasHeight = options.canvasHeight;
        }
        
    }//end of outer if	
     
      
    try {
		prepareGraph(); 
		
		//try to draw the graph
		recLeft = rectWidth + graphAllPadding;
        for (var i = xDomain.start; i < numberofElements; i++) {
        	var dataHeight = "data[i]" +operand + heightRatio;
        	
            var bar = $(document.createElementNS("http://www.w3.org/2000/svg", "rect")).attr({
                id: "rec" + i,
                x: recLeft,
                y: graphBottom - graphAllPadding,
                width: rectWidth,
                style: "stroke-width:2",
                rx:"8",
                ry:"8",
                height: eval(dataHeight),
                stroke: "black",
                fill: color,
                transform: "rotate(180," + (recLeft + graphAllPadding) + "," + (graphBottom - 15) + ")",
                opacity: barOpacity
            });

            var group = $(document.createElementNS("http://www.w3.org/2000/svg", "g")).attr({
                id: "g" + i
            });
			
			var prefix = (options != null && options.dataPrefix != undefined) ? options.dataPrefix : "";
            var postfix = (options != null && options.dataPostfix != undefined) ? options.dataPostfix : ""; 
			var xOffset = prefix  + data[i] + postfix;
			var xdisp = recLeft + (rectWidth * fontDerv) + (graphAllPadding * fontSizeRatio);
			
			if (xOffset != undefined &&  xOffset != null){
				console.log(xOffset.length);
				xdisp = xdisp - xOffset.length;
			}
			// x: recLeft + (rectWidth * fontDerv) + (graphAllPadding * fontSizeRatio),
            
            var mon = $(document.createElementNS("http://www.w3.org/2000/svg", "text")).attr({
                id: "label" + i,
                x: recLeft + (rectWidth * fontDerv) + (graphAllPadding * fontSizeRatio),
                y: graphBottom - eval(dataHeight) - 25,
                fill: "black",
                style:"font-size:" + fontSize
            });

            if (xDomain.labels && xDomain.labels.length == data.length) {
                var lables = $(document.createElementNS("http://www.w3.org/2000/svg", "text")).attr({
                    id: "glabel" + i,
                    x: recLeft + (rectWidth * fontDerv) + (graphAllPadding * fontSizeRatio),
                    y: graphBottom,
                    fill: "black",
                    style:"font-size:" + fontSize
                });
                lables.append(xDomain.labels[i]);
                $("#svgCanvas").append(lables);
            }//end of if            	
            
            mon.append(prefix  + data[i] + postfix);
            recLeft = recLeft + rectWidth + recPadding;


            $("#svgCanvas").append(group);
            $("#g" + i).append(bar);
            $("#g" + i).append(mon);
            //$("#svgCanvas").append(mon);
        }//end of for

    } catch (e) {
		console.log(e);

    } //end of try/catch
	
	return this;
};//end of drawGraph function


this.drawLineGraph = function(){

	//set option settings
    if (options != undefined || options != null) {        
        
        if (options.color != undefined){
            color = options.color;
        }
        
       if (options.pointRadius != undefined){
			lineChartRadius = options.pointRadius;
	   }
	   
	   if (options.pointColor != undefined){
			lineChartPointColor = options.pointColor;
	   }
	   
	   if (options.lineWidth != undefined){
			defaultStrokeWidth = options.lineWidth;
	   }
        
    }//end of outer if
	//prepare graph
	prepareGraph();
	recLeft = recLeft + rectWidth;
	//try to draw the graph	
	var mBeginPoint = [(recLeft + graphAllPadding) - rectWidth,graphBottom - graphAllPadding];
	var mEndPoint = [];
    for (var i = xDomain.start; i < numberofElements; i++) { 
		mEndPoint.push(recLeft);		
		mEndPoint.push(eval("data[i]" +operand + heightRatio));
		
		var lineV = $(document.createElementNS("http://www.w3.org/2000/svg", "line")).attr({
            id: "lineVerizon" + i,
            x1: mBeginPoint[0],
            y1: mBeginPoint[1],
            x2: mEndPoint[0],
            y2: mEndPoint[1],
            style: "stroke:" + color + ";stroke-width:" + defaultStrokeWidth + ";"
        });
		
		var linePoint = $(document.createElementNS("http://www.w3.org/2000/svg", "circle")).attr({
            id: "lineVerizonPoint" + i,
            cx: mEndPoint[0],
            cy: mEndPoint[1],
            r: lineChartRadius,
			style: "fill:" + lineChartPointColor + ";"
        });
		
		  var mon = $(document.createElementNS("http://www.w3.org/2000/svg", "text")).attr({
                id: "label" + i,
                x: mEndPoint[0] + 10,
                y: mEndPoint[1] + 10,
                fill: "black",
                style:"font-size:" + fontSize
            });

		//x axis labels
		if (xDomain.labels && xDomain.labels.length == data.length) {
                var lables = $(document.createElementNS("http://www.w3.org/2000/svg", "text")).attr({
                    id: "glabel" + i,
                    x: recLeft,
                    y: graphBottom,
                    fill: "black",
                    style:"font-size:" + fontSize
                });
                lables.append(xDomain.labels[i]);
                $("#svgCanvas").append(lables);
        }//end of if		
		

        $("#svgCanvas").append(lineV);
		$("#svgCanvas").append(linePoint);
		$("#svgCanvas").append(mon);
		recLeft = recLeft + rectWidth;
		
		mBeginPoint = mEndPoint.slice();		
		mEndPoint = [];
		
	}//end of for	
	 
	return this;
};//end of drawLineGraph function   
    
return this;

};
/**
EXAMPLE USAGE BELOW
**/
/**
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

	var barTest = $("#drawBoard").KmGraphs(yAxis, xAxis, myData, options).drawLineGraph();
	
	
}); **/