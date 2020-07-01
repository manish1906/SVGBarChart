﻿Follow the below steps to use canvas barchart:
1) add the "app-chart-directive.js" script file in the application

2)Provide below keys to print X and Y axis and sorting as well:
		xaxisitemskey="surname"   // Provide the field name to print  X axis value 
		yaxisitemskey="value" 	  // Provide the field name  to print Y axis value 
		orderbykey="lastUpdated"  // Provide the field name to sort the data-list collection

2) Add the below line of code in HTML:
	<canvas-Bar-Chart items="chartDataList" xaxisitemskey="surname" yaxisitemskey="value" orderbykey="lastUpdated"> </canvas-Bar-Chart>



Here is a basic sample that shows how to add a chart:

@@@@@@ html

<!DOCTYPE html>
<html >
<head>
    <title>Bar Chart</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.9/angular.js"></script>

    <script src="app.js"></script>
    <script src="Scripts/app/controller/simple-bar-chart-controller.js"></script>
    <script src="Scripts/app/appdirective/app-chart-directive.js"></script>


    <link rel="stylesheet" type="text/css" href="Style/appChart.css">
</head>
<body ng-app="barchartapp">
    <div ng-controller="barchartController as ctrl" ng-init="initChart()">
        
        <div id="barchartid" class="bchartcontainer">
            <bar-Chart items="chartDataList" xaxisitemskey= "title" yaxisitemskey = "value" resize> </bar-Chart>
        </div>
    </div>
</body>
</html>