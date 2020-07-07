var appChartDirective = angular.module('app-chart.directive', []);
appChartDirective.directive("lineChart", function ($filter, $compile) {
    return {
        restrict: 'E',

        scope: {
            chartDataItem: '=items',
            xAxisItemsKey: '@xaxisitemskey',
            yAxisItemsKey: '@yaxisitemskey',
            orderByKey: '@orderbykey'
        },
        link: function (scope, element) {
            var $destroy = scope.$on("$destroy", function () {
                $destroy();
                $destroy = null;
                chartWatch();
                chartWatch = null;
                $(element).off();
                $(element).detach();
                element = null;
                scope = null;
            });

            var chartWatch = scope.$watch(
                "svgLineChart",
                function handleLineChartDraw(v) {
                    scope.drawLineChart();
                }
            );

            $(window).resize(function () {
                if ($("#svgcontainer").length > 0) {
                    $("#svgcontainer").empty();
                }
                scope.drawLineChart();
            });

            //Function to specify Chart settings
            scope.drawLineChart = function () {
                scope.svgobj = {                  
                    padding: 20,                    
                    data: $filter('orderBy')(scope.chartDataItem, scope.orderByKey, true),                                 
                    maximumDataValue: 100,
                    maxTicksLimit: 5
                };
               
                scope.padding = scope.svgobj.padding;
                scope.width = $("#svgcontainer").parent().width();
                scope.height = $("#svgcontainer").height();
                console.log("width"+scope.width)
                var svgChartWidth = scope.width - 2 * scope.padding;
                var svgChartHeight = scope.height - 2 * scope.padding;
                scope.chartDataList = scope.svgobj.data;
                scope.length = scope.chartDataList.length;
                //For X Axis
                scope.drawLine(scope.padding, svgChartHeight + scope.padding, svgChartWidth + scope.padding, svgChartHeight + scope.padding,2);
                //For Y Axis
                scope.drawLine(scope.padding, scope.padding, scope.padding, svgChartHeight + scope.padding,2);

                scope.drawYAxisMarkers(svgChartHeight, svgChartWidth);
                scope.drawChartWithCalculation(svgChartHeight, svgChartWidth);             
             
            };
            //Ends Here
            scope.drawLine = function (x1, y1, x2, y2, strokeWidth) {
                var dataAxis = document.createElementNS("http://www.w3.org/2000/svg", 'line');
                dataAxis.setAttribute("x1", x1);
                dataAxis.setAttribute("y1", y1);
                dataAxis.setAttribute("x2", x2);
                dataAxis.setAttribute("y2", y2);
                dataAxis.style.stroke = "black";
                dataAxis.style.strokeWidth = strokeWidth+"px";
                document.getElementById('svgcontainer').appendChild(dataAxis);

            }


            //Draw Markers on the Y Axis
            scope.drawYAxisMarkers = function (svgChartHeight,svgChartWidth) {
                //
                var labelOnYAxis = 0;
                var extensionnumber = 0;
                //Find maximum data value from given data
                scope.maxDataValue = scope.svgobj.maximumDataValue;
                for (var i = 0; i < scope.chartDataList.length; i++) {
                    scope.maxDataValue = Math.max(scope.maxDataValue, scope.chartDataList[i][scope.yAxisItemsKey]);
                }
                //var incrBy = scope.determineStepSize();
                var incrBy = Math.round(scope.maxDataValue / scope.svgobj.maxTicksLimit);               

                while (labelOnYAxis <= (scope.maxDataValue + extensionnumber)) {
                    markerVal = labelOnYAxis;
                    var xMarkers = 0;
                    var yMarkers = svgChartHeight * (1 - markerVal / scope.maxDataValue) + scope.padding;
                    textelement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                    textelement.setAttribute('dx', xMarkers);
                    textelement.setAttribute('dy', yMarkers);
                    textelement.setAttribute('font-size', "smaller");
                    //textelement.setAttribute('width', '5px');
                    //  textelement.setAttribute('textLength', '20px');
                    textelement.style.position = 'absolute';
                    txtnode = document.createTextNode(markerVal);
                    textelement.appendChild(txtnode);

                    document.getElementById('svgcontainer').appendChild(textelement);
                    labelOnYAxis = labelOnYAxis + incrBy;
                   
                    //debugger
                    scope.drawLine(scope.padding, yMarkers, svgChartWidth + scope.padding, yMarkers,0.5)
                }
            };
            //Ends Here
            //Function to draw linechart for all entries in the  Array
            scope.drawChartWithCalculation = function (svgChartHeight,svgChartWidth) {

                for (var i = 0; i < scope.length; i++) {
                    var remain = scope.length - 1;
                    scope.chartDataList[remain - i]["index"] = i;
                }
                                 
                    const points = scope.chartDataList
                        .map(element => {                            
                            const x = (element.index / (scope.length-1)) * svgChartWidth + scope.padding;                         
                            const y = svgChartHeight - (element.value / scope.maxDataValue) *svgChartHeight + scope.padding;
                            scope.drawCircleForChart(x, y);   
                            return `${x},${y}`;
                            
                        })
                    .join(" ");
              
                scope.drawXAxisMarkers(svgChartHeight, svgChartWidth);
                scope.drawLineForChart(points);                 
                
                
            };
            //Ends Here
            //Function to Draw Markers on the X Axis
            scope.drawXAxisMarkers = function (svgChartHeight, svgChartWidth) {
                for (var i = 0; i < scope.length; i++) {
                    var remain = scope.length - 1;
                    name = scope.chartDataList[remain - i].surname;
                    markerXPosition = scope.chartDataList[remain - i].index / (scope.length-1) * svgChartWidth + scope.padding;
                    markerYPosition = scope.padding + svgChartHeight+15 ;
                    textelement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                    textelement.setAttribute('dx', markerXPosition);
                    textelement.setAttribute('dy', markerYPosition);
                    textelement.setAttribute('font-size', 'smaller');
                    txtnode = document.createTextNode(name);
                    textelement.appendChild(txtnode);
                    document.getElementById('svgcontainer').appendChild(textelement);
                }
            };
            //Ends Here

            //Method to Draw Line
            scope.drawLineForChart = function (points) {
                var line = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
                line.setAttribute('stroke', 'blue');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('points', points);
                line.setAttribute('fill', "none ");
                document.getElementById('svgcontainer').appendChild(line);
            }; 
            
            scope.drawCircleForChart = function (x,y) {
                var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                circle.setAttribute('stroke', ' #0074d9');
                circle.setAttribute('stroke-width', '2');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
                circle.setAttribute('r', "3");
                circle.setAttribute('fill', "blue ");
                document.getElementById('svgcontainer').appendChild(circle);
            };      
        },
        template: ' <svg id="svgcontainer" height="256" width="100%"></svg>'       
    };
});
