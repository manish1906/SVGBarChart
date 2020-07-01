//const { $ } = require("protractor");

var appChartDirective = angular.module('app-chart.directive', []);
appChartDirective.directive("svgChart", function ($filter, $compile) {
    return {
        restrict: 'E',

        scope: {
            chartDataItem: '=items',
            xAxisItemsKey: '@xaxisitemskey',
            yAxisItemsKey: '@yaxisitemskey',
            orderByKey: '@orderbykey'
        },
        link: function (scope, element, $rootScope) {
            scope.scrollableparentid = "";
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
                "svgBarChart",
                function handleBarChartDraw(v) {
                    scope.drawBarChart();
                }
            );

            $(window).resize(function () {
                scope.drawBarChart();
            });

            //Function to specify Chart settings
            scope.drawBarChart = function () {
                if ($("#svgcontainer").length > 0) {
                    $("#svgcontainer").empty();
                }
                scope.svgObj = {
                    padding: 20,
                    gridColor: "#2196F3",
                    data: $filter('orderBy')(scope.chartDataItem, scope.orderByKey, true),
                    barWidth: 50,
                    maximumDataValue: 100,
                    maxTicksLimit: 5
                };
                scope.width = $("#svgcontainer").parent().width();
                scope.height = $("#svgcontainer").height();
                scope.padding = scope.svgObj.padding;

                var div = document.getElementById("svgcontainer");

                var rect = div.getBoundingClientRect();
                scope.x = rect.left;
                scope.y = rect.top;
                console.log("left"+scope.x+"top"+scope.y);
                var svgChartWidth = scope.width - 2 * scope.padding;
                var svgChartHeight = scope.height - 2 * scope.padding;
                console.log(svgChartWidth)
                scope.totalChartBars = Math.round(svgChartWidth / scope.svgObj.barWidth);
                scope.barSize = scope.svgObj.barWidth;
                scope.remainNumberOfBars = scope.totalChartBars - scope.svgObj.data.length;
                scope.chartDataList = $filter('limitTo')(scope.svgObj.data, scope.totalChartBars, 0);
                var length = scope.chartDataList.length;

                scope.nameList = []; //For Tooltip purpose
                for (i = 0; i < scope.chartDataList.length; i++)
                    scope.nameList.push({ 'barName': scope.chartDataList[i][scope.xAxisItemsKey] });

                //Add empty bars at left side if chart does not have sufficient bars
                if (scope.totalChartBars > scope.chartDataList.length) {
                    for (i = 0; i < scope.totalChartBars - length; i++) {
                        scope.chartDataList.push({ [scope.xAxisItemsKey]: "0", "value": "0", "index": length + i });
                        scope.nameList.push({ 'barName': "0", "index": length + i });
                    }
                }
                scope.drawYAxisMarkers(svgChartHeight);
                scope.drawChartWithCalculation(svgChartHeight);
                console.log(scope.nameList);
               // debugger
            };
            //Ends Here

            //Draw Markers on the Y Axis
            scope.drawYAxisMarkers = function (svgChartHeight) {
                var labelOnYAxis = 0;
                //Find maximum data value from given data
                scope.maxDataValue = scope.svgObj.maximumDataValue;
                for (var i = 0; i < scope.chartDataList.length; i++) {
                    scope.maxDataValue = Math.max(scope.maxDataValue, scope.chartDataList[i][scope.yAxisItemsKey]);
                }
                const incrBy = Math.round(scope.maxDataValue / scope.svgObj.maxTicksLimit);

                ////Next level deveopment: Dynamic Y-axis value print  on Hold
                //var incrBy = scope.determineStepSize();
                // var extensionNumber = 0;
                //var extensionNumber = ((incrBy * Math.ceil(scope.maxDataValue / incrBy)) - scope.maxDataValue);
                // while (labelOnYAxis <= (scope.maxDataValue + extensionnumber)) {

                while (labelOnYAxis <= (scope.maxDataValue)) {
                    const markerVal = labelOnYAxis;
                    const xMarkers = scope.padding;
                    const yMarkers = svgChartHeight * (1 - markerVal / scope.maxDataValue) + scope.padding;
                    textelement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                    textelement.setAttribute('dx', xMarkers);
                    textelement.setAttribute('dy', yMarkers);
                    textelement.setAttribute('font-size', 'smaller');
                    txtnode = document.createTextNode(markerVal);
                    textelement.appendChild(txtnode);
                    document.getElementById('svgcontainer').appendChild(textelement);
                    labelOnYAxis = labelOnYAxis + incrBy;
                }
            };
            //Ends Here
            //Function to draw barchart for all entries in the  Array
            scope.drawChartWithCalculation = function (svgChartHeight) {
                for (var i = 0; i < scope.totalChartBars; i++) {
                    const remain = scope.totalChartBars - 1;
                    barChartVal = scope.chartDataList[remain - i][scope.yAxisItemsKey];
                    barChartHeight = (barChartVal * svgChartHeight / scope.maxDataValue);
                    barChartX = 2 * scope.padding + i * scope.barSize;
                    barChartY = (scope.padding + svgChartHeight - barChartHeight);
                    scope.drawRectangleForChart(barChartX, barChartY, scope.barSize - 8, barChartHeight);
                    //Add x1, x2 property to the nameList array for tooltip purpose
                    scope.nameList[remain - i]["x1"] = Math.round(barChartX + scope.x);
                    scope.nameList[remain - i]["x2"] = barChartX + scope.barSize + scope.x;
                    scope.nameList[remain - i]["y1"] = barChartY+scope.y;
                    scope.nameList[remain - i]["y2"] =barChartY+barChartHeight+scope.y;
                   // debugger
                }
                scope.drawXAxisMarkers(svgChartHeight);
            };

            //Function to Draw Markers on the X Axis
            scope.drawXAxisMarkers = function (svgChartHeight) {
                for (var i = 0; i < scope.totalChartBars; i++) {
                    const remain = scope.totalChartBars - 1;
                    const name = scope.chartDataList[remain - i][scope.xAxisItemsKey];
                    markerXPosition = 2 * scope.padding + ((scope.barSize - 8) / 2) + i * scope.barSize;
                    markerYPosition = scope.padding + svgChartHeight + 15;

                    textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                    textElement.setAttribute('dx', markerXPosition);
                    textElement.setAttribute('dy', markerYPosition);
                    textElement.setAttribute('font-size', 'smaller');
                    textElement.setAttribute('text-anchor', 'middle');
                    txtNode = document.createTextNode(name);
                    textElement.appendChild(txtNode);
                    document.getElementById('svgcontainer').appendChild(textElement);
                }

                ////NetxLevel development: Need tO work on tool-tip
                // var scrollednode = scope.getScrollParent($('#svgcontainer')[0]);
                // debugger;
                // scope.scrollableparentid = (scrollednode.id !== undefined ? scrollednode.id : "");
                // scope.scrollHeight = (scrollednode.scrollHeight !== undefined ? scrollednode.scrollHeight : "");
                // scope.clientHeight = (scrollednode.clientHeight !== undefined ? scrollednode.clientHeight : "");
                // if (scope.hasscroll) {
                //     scope.setScrollTop();
                // }

            };
            //Ends Here
            $(window).mousemove(function (event) {
                $("p").text(" X:" + event.pageX + ", Y:" + event.pageY);
            });
            //Method to Draw rectangle
            scope.drawRectangleForChart = function (x, y, wd, ht) {
                var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('width', wd);
                rect.setAttribute('height', ht);
                rect.setAttribute('fill', scope.svgObj.gridColor);

                // $(window).mousemove(function (event) {

                //     $("p").text(" X:" + event.pageX + ", Y:" + event.pageY);
                // });

                //mousemove event on rect element
                $(rect).mousemove(function (event) {
                    var arrx = [];

                    arrx = $.grep(scope.nameList, function (n) {
                        //debugger;
                        return (n.x1 <= event.pageX && n.x2 >= event.pageX);
                    });
                    if (arrx.length > 0)
                        $("span").text("Name: " + arrx[0].barName + " X:" + event.pageX + ", Y:" + event.pageY);

                    $("#svgcontainer").mousemove(function (event) {
                        $("p").text(" X:" + event.pageX + ", Y:" + event.pageY);
                    });

                    scope.updateToolTipPosition(y, ht);
                    //debugger
                });
                $(rect).mouseleave(function () {
                    $("span").slideUp();
                });
                document.getElementById('svgcontainer').appendChild(rect);
            };
            scope.buildToolTipElement = function () {
                if (!this.popoverEl) {
                    this.popoverTpl = '<span></span>';

                    this.popoverEl = $compile(this.popoverTpl)(scope);
                   // element.append(this.popoverEl);
                       $("body").append(this.popoverEl);
                }
            };
            scope.updateToolTipPosition = function (y, ht) {
                if (!this.popoverEl) {
                    scope.buildToolTipElement();
                }

                this.popoverEl.show();
                var boxWidth = 110;
                var boxHeight = 25;
                var xposition = event.pageX+10;   
                var yposition = event.pageY;
                var div = document.getElementById("barchartid");
                var chart = div.getBoundingClientRect();
                console.log("top"+chart.top)
                console.log("left"+chart.left)
            
              var scrollTop= $(window).scrollTop();          
             
              //If tooltip is end of with then change position of tooltip
                if (event.pageX + boxWidth > scope.width) {
                    
                    xposition = xposition - boxWidth-25;                   
                }
                if (event.pageY + boxHeight >= y + ht ) {
                 // debugger
                    yposition = yposition - boxHeight;
                   // debugger
                }
                //console.log("xposition"+xposition+"yposition"+yposition)
                if(chart.top > yposition-scrollTop)
                {
                  //  debugger
                    yposition=yposition+boxHeight
                    //debugger
                }
 console.log("-posito"+(yposition-scrollTop))
                console.log("xposition"+xposition+"yposition"+yposition)
               // yposition = yposition -185;
                this.popoverEl
                    .css({
                        'left': xposition + 'px',
                        'top': yposition + 'px',
                        'height': boxHeight + 'px',
                        'width': boxWidth + 'px',
                        'background-color': 'white',
                        'border': '1px solid blue',
                        'position': 'absolute',
                        'font-size': '11px',
                        'font-family': 'Segoe UI',
                        'position': 'absolute'
                    });
            };


            //#region  Next level development function for Tool-tip
            scope.getScrollParent = function (node) {
                const isElement = node instanceof HTMLElement;
                const overflowY = isElement && window.getComputedStyle(node).overflowY;
                const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';
                if (!node) {
                    return null; 0
                } else if (isScrollable && node.scrollHeight >= node.clientHeight) {
                    if (angular.isUndefined(node.id) || node.id === "") {
                        $(node).attr('id', 'barscrollparentid');
                    }
                    const scrollLeft = $("#" + node.id).scrollLeft();
                    const scrollTop = $("#" + node.id).scrollTop();
                    if ((node.scrollHeight - node.clientHeight) > 0) {
                        scope.chartscrollTop = ((scrollTop !== undefined) ? scrollTop : 0);
                        scope.TotalScrollTop = ((node.scrollHeight - node.clientHeight) !== undefined ? (node.scrollHeight - node.clientHeight) : 0);
                        scope.hasscroll = true;
                    }
                    return node;
                }

                return scope.getScrollParent(node.parentNode) || document.body;
            };
            scope.setScrollTop = function () {
                if (scope.scrollableparentid !== "") {
                    $('#' + scope.scrollableparentid).scrollTop(scope.scrollHeight - scope.clientHeight);
                }
            };
            scope.determineStepSize = function (maxDatasetValue) {
                var maxStepTemp = Math.ceil(maxDatasetValue / scope.svgobj.maxTicksLimit);
                // Determine what the step should be based on the maxStepTemp value
                if (maxStepTemp > 4000000) step = 8000000;
                else if (maxStepTemp > 2000000) step = 4000000;
                else if (maxStepTemp > 1000000) step = 2000000;
                else if (maxStepTemp > 500000) step = 1000000;
                else if (maxStepTemp > 250000) step = 500000;
                else if (maxStepTemp > 100000) step = 200000;
                else if (maxStepTemp > 50000) step = 100000;
                else if (maxStepTemp > 25000) step = 50000;
                else if (maxStepTemp > 10000) step = 20000;
                else if (maxStepTemp > 5000) step = 10000;
                else if (maxStepTemp > 2500) step = 5000;
                else if (maxStepTemp > 1000) step = 2000;
                else if (maxStepTemp > 500) step = 1000;
                else step = 500;
                return step;
            };
            //#endregion

            scope.$root.$on('barchart-refresh', function () {
                scope.drawBarChart();
            })


        },
        post: function (scope) {
            scope.$on('barchart-refresh', function (event, data) {
                alert('hi post');
            });
        },
        // template: '<svg id="svgcontainer" height="256" width="100%"></svg>'
        // template: '<div style="position: relative; width: 100%;" id="svgparentdiv"> <svg id="svgcontainer" height="256" width="100%"></svg> </div>'
        template: '<g id="circle-group"> <svg id="svgcontainer" height="256" width="100%"></svg> </g>'
    };
});
