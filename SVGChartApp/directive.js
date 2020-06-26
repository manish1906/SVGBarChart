app.directive("svgChart", function ($filter, $compile) {
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
                "svgBarChart",
                function handleBarChartDraw(v) {
                    scope.drawBarChart();
                }
            );

            $(window).resize(function () {
                if ($("#svgcontainer").length > 0) {
                    $("#svgcontainer").empty();
                }
                scope.drawBarChart();
            });

            //Function to specify Chart settings
            scope.drawBarChart = function () {
                scope.svgobj = {
                    //canvas: basvg,
                    padding: 20,
                    gridScale: 10,          //Increment value of label on Y axis 
                    gridColor: "#eeeeee",
                    data: $filter('orderBy')(scope.chartDataItem, scope.orderByKey, true),
                    barWidth: 50,
                    maximumDataValue: 100,
                    maxTicksLimit: 5
                };
                var div = document.getElementById("svgcontainer");
                var rect = div.getBoundingClientRect();
                scope.x = rect.left;
                scope.y = rect.top;
                w = rect.width;
                h = rect.height;
                console.log("Left: " + scope.x + ", Top: " + scope.y + ", Width: " + w + ", Height: " + h);
                scope.padding = scope.svgobj.padding;

                scope.width = $("#svgcontainer").parent().width();
                scope.height = $("#svgcontainer").height();
                console.log("width"+scope.width)
                var svgChartWidth = scope.width - 2 * scope.padding;
                var svgChartHeight = scope.height - 2 * scope.padding;

                scope.totalChartBars = Math.round(svgChartWidth / scope.svgobj.barWidth);
                scope.barSize = scope.svgobj.barWidth;
                scope.chartDataList = scope.svgobj.data;
                var length = scope.chartDataList.length;
                console.log("TotalCharts" + scope.totalChartBars)
                //For Tooltip purpose
                scope.nameList = [];
                for (i = 0; i < length; i++)
                    scope.nameList.push({ 'barName': scope.chartDataList[i][scope.xAxisItemsKey] });

                //Add empty bars at left side if chart does not have sufficient bars
                if (scope.totalChartBars > scope.chartDataList.length) {
                    for (i = 0; i < scope.totalChartBars - length; i++) {
                        scope.chartDataList.push({ "name": "0", "value": "0", "index": length + i });
                        scope.nameList.push({ 'barName': "0", "index": length + i });
                    }
                    
                }
                //debugger
                scope.drawYAxisMarkers(svgChartHeight);
                scope.drawChartWithCalculation(svgChartHeight);
             // debugger
            };
            //Ends Here

            //Draw Markers on the Y Axis
            scope.drawYAxisMarkers = function (svgChartHeight) {
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
                //var extensionnumber = ((incrBy * Math.ceil(scope.maxDataValue / incrBy)) - scope.maxDataValue);

                while (labelOnYAxis <= (scope.maxDataValue + extensionnumber)) {
                    markerVal = labelOnYAxis;

                    var xMarkers = scope.padding;
                    var yMarkers = svgChartHeight * (1 - markerVal / scope.maxDataValue) + scope.padding;
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
                    var remain = scope.totalChartBars - 1;
                    barChartVal = scope.chartDataList[remain - i].value;

                    barChartHeight = (barChartVal * svgChartHeight / scope.maxDataValue);
                    barChartX = 2 * scope.padding + i * scope.barSize;
                    barChartY = (scope.padding + svgChartHeight - barChartHeight);

                    //Add x1, x2 property to the nameList array for tooltip purpose
                    scope.nameList[remain - i]["x1"] = Math.round(barChartX + scope.x);
                    scope.nameList[remain - i]["x2"] = barChartX + scope.barSize + scope.x;
                    //debugger
                    scope.drawRectangleForChart(barChartX, barChartY, scope.barSize - 8, barChartHeight, svgChartHeight);
                    //console.log(namelist)
                    console.log(scope.namelist)
                }
                scope.drawXAxisMarkers(svgChartHeight);
            };

            //Function to Draw Markers on the X Axis
            scope.drawXAxisMarkers = function (svgChartHeight) {
                for (var i = 0; i < scope.totalChartBars; i++) {
                    var remain = scope.totalChartBars - 1;
                    name = scope.chartDataList[remain - i].surname;
                    markerXPosition = 2 * scope.padding + ((scope.barSize - 8) / 2) + i * scope.barSize;
                    markerYPosition = scope.padding + svgChartHeight + 15;

                    //if (name == 'd') {
                    //    $("#barcrd").append("xp: " + markerXPosition + " Yp: " + markerYPosition);
                    //}
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

            //Method to Draw rectangle
            scope.drawRectangleForChart = function (x, y, wd, ht,) {
                var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('width', wd);
                rect.setAttribute('height', ht);
                rect.setAttribute('fill', "#2196F3");
                
                //$(window).mousemove(function (event) {

                //    $("p").text(" X:" + event.pageX + ", Y:" + event.pageY);
                //});

                //mousemove event on rect element
                $(rect).mousemove(function (event) {
                    var arrx = [];

                    arrx = $.grep(scope.nameList, function (n) {
                        ////debugger;
                        return (n.x1 <= event.pageX && n.x2 >= event.pageX);
                    });
                    if (arrx.length > 0)
                        $("span").text("Name: " + arrx[0].barName + " X:" + event.pageX + ", Y:" + event.pageY);

                    $("#svgcontainer").mousemove(function (event) {

                        $("p").text(" X:" + event.pageX + ", Y:" + event.pageY);
                    });

                    scope.update(y,ht);
                    //debugger
                });
                $(rect).mouseleave(function () {
                    $("span").slideUp();
                });
                document.getElementById('svgcontainer').appendChild(rect);
            };
            scope.build = function () {
                if (!this.popoverEl) {
                    this.popoverTpl = '<span></span>';

                    this.popoverEl = $compile(this.popoverTpl)(scope);

                    element.append(this.popoverEl);

                }
            };
            scope.update = function (y,ht) {
                if (!this.popoverEl) {
                    scope.build();
                }

                this.popoverEl.show();
                var boxWidth = 110;
                var boxHeight = 25;
                var xposition = event.pageX + 10;
                var yposition = event.pageY;
             
               
                //If tooltip is end of with then change position of tooltip
                if (event.pageX + boxWidth > scope.width) {

                    xposition = xposition - boxWidth-25;
                   
                }
                if (event.pageY + boxHeight >= y + ht ) {
                    //debugger
                    yposition = yposition - boxHeight-;

                }
                console.log("xposition" + xposition + "yposition" + yposition)
                console.log("y+ht"+(y+ht+scope.y))
                //xposition = 1140 -15;
                //yposition = 20-25;
                this.popoverEl
                    .css({
                        'left': xposition + 'px',
                        'top': yposition + 'px',
                        'height': boxHeight + 'px',
                        'width': boxWidth + 'px',
                        'background-color': 'white',
                'border': '1px solid blue',
                'position': 'absolute',
                'font-size':' 11px',
                'font-family': 'Segoe UI',
                    });
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
        },

        template: ' <svg id="svgcontainer" height="256" width="100%"></svg>'
        //template: '<div style="position: relative; width: 100%;" id="parentsvgdiv"> <svg id="svgcontainer" style="max-width: 100%;height: 256px;"> </svg> </div>  '

    };
});
