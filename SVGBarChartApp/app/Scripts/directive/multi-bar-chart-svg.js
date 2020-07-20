var appChartDirective = angular.module('app-chart.directive', []);
appChartDirective.directive("svgMultiBarChart", function ($filter, $compile) {
    return {
        restrict: 'E',

        scope: {
            chartDataItem: '=items',
            chartDataItem2: '=items2',
            xAxisItemsKey: '@xaxisitemskey',
            yAxisItemsKey: '@yaxisitemskey',
            orderByKey: '@orderbykey'
        },
        link: function (scope, element, $rootScope) {

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
                "svgMultiBarChart",
                function handleBarChartDraw(v) {
                    scope.drawBarChart();
                }
            );

            //Call while window resize
            $(window).resize(function () {
                scope.drawBarChart();
            });

            //Draw barchart
            scope.drawBarChart = function () {
                if ($("#svgMultiBarChartContainer_" + scope.$id).length > 0) {
                    $("#svgMultiBarChartContainer_" + scope.$id).empty();
                    this.popoverEl = null;
                }
                if ($("#tip_" + scope.$id).length > 0) {
                    $("#tip_" + scope.$id).remove();
                }

                //Concat two Array and filter data by last update date
                var concatChart = scope.chartDataItem.concat(scope.chartDataItem2);
                scope.chartDataList = $filter('orderBy')(concatChart, scope.orderByKey, true);

                //Find data that is not in array2 but in array1
                const result1 = scope.chartDataItem.filter(f =>
                    !scope.chartDataItem2.some(d => d.surname == f.surname)
                );
                //Find data that is not in array1 but in array2
                const result2 = scope.chartDataItem2.filter(f =>
                    !scope.chartDataItem.some(d => d.surname == f.surname)
                );
                //concat array
                const result = result1.concat(result2)
                //push value 0 in......
                for (i = 0; i < result.length; i++) {
                    index = scope.chartDataItem.indexOf(result[i]);
                    if (index > 0) {
                        const a = scope.chartDataList.indexOf(result[i]);
                        surName = result[i].surname;
                        scope.chartDataList.splice(a, 0, { "surname": surName, "value": 0 });
                    }
                    else {
                        const a = scope.chartDataList.indexOf(result[i]);
                        surName = result[i].surname;
                        scope.chartDataList.splice(a + 1, 0, { "surname": surName, "value": 0 });
                    }
                }
                console.log(scope.chartDataList)
                scope.svgObj = {
                    padding: 45,
                    gridColor: "#2196F3",
                    gridColor2: "#3f51b5",
                    barWidth: 50,
                    maximumDataValue: 100,
                    maxTicksLimit: 5,
                    toolTipHeight: 40,
                    toolTipWeight: 100
                };
                //Variables
                scope.scrollableParentId = "";
                scope.width = $("#svgMultiBarChartContainer_" + scope.$id).parent().width();
                scope.height = $("#svgMultiBarChartContainer_" + scope.$id).height();
                scope.padding = scope.svgObj.padding;
                scope.barSize = scope.svgObj.barWidth;
                var svgChartWidth = scope.width - 2 * scope.padding;
                var svgChartHeight = scope.height - 2 * scope.padding;
                console.log(svgChartWidth)
                var div = document.getElementById("svgMultiBarChartContainer_" + scope.$id);
                var rect = div.getBoundingClientRect();
                scope.x = rect.left;
                scope.y = rect.top;

                //Calculate the possible max items/bars to be print and assigned to the data-list
                scope.totalChartBars = 2 * Math.floor(svgChartWidth / (2 * scope.svgObj.barWidth));
                scope.chartDataList = $filter('limitTo')(scope.chartDataList, scope.totalChartBars, 0);
                var length = scope.chartDataList.length;
                console.log(scope.totalChartBars)

                //Add empty bars at left side if chart does not have sufficient bars
                if (scope.totalChartBars > scope.chartDataList.length) {
                    for (i = 0; i < scope.totalChartBars - length; i++) {
                        scope.chartDataList.push({ [scope.xAxisItemsKey]: "0", "value": "0", "index": length + i });
                    }
                }
                scope.drawYAxisMarkers(svgChartHeight);
                scope.drawChartWithCalculation(svgChartHeight);
                console.log(scope.chartDataList);
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

                while (labelOnYAxis <= (scope.maxDataValue)) {
                    const markerVal = labelOnYAxis;
                    const xMarkers = scope.padding;
                    const yMarkers = svgChartHeight * (1 - markerVal / scope.maxDataValue) + scope.padding;
// debugger
                    textelement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                    textelement.setAttribute('dx', xMarkers);
                    textelement.setAttribute('dy', yMarkers + 4);
                    textelement.setAttribute('font-size', 'smaller');
                    txtnode = document.createTextNode(markerVal);
                    textelement.appendChild(txtnode);
                    document.getElementById('svgMultiBarChartContainer_' + scope.$id).appendChild(textelement);
                    labelOnYAxis = labelOnYAxis + incrBy;
                }
            };
            //Ends Here

            //Set the x, y, h and w to draw barchart rectangle
            scope.drawChartWithCalculation = function (svgChartHeight) {
                for (var i = 0; i < scope.totalChartBars; i++) {
                    const remain = scope.totalChartBars - 1;
                    barChartVal = scope.chartDataList[remain - i][scope.yAxisItemsKey];
                    barChartHeight = (barChartVal * svgChartHeight / scope.maxDataValue);
                    barChartY = (scope.padding + svgChartHeight - barChartHeight);
                    if (i % 2 == 0) {
                        barChartX = 2 * scope.padding + i * scope.barSize;
                        color = scope.svgObj.gridColor;
                        var rectId = i;
                    }
                    else {
                        barChartX = barChartX + scope.barSize - 8;
                        color = scope.svgObj.gridColor2;
                        rectId = "10" + i - 1;
                    }
                    if (i == remain) {
                        //  debugger
                        scope.lastWidth = barChartX + scope.barSize - 8;
                    }
                    scope.drawRectangleForChart(barChartX, barChartY, scope.barSize - 8, barChartHeight, color, rectId);
                }
                scope.drawXAxisMarkers(svgChartHeight);
            };

            //Draw rectangle and set the mouse event to each and every rectangle
            scope.drawRectangleForChart = function (x, y, wd, ht, color, rectId) {
                var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                rect.setAttribute('id', 'svgrec_' + rectId + scope.$id);
                rect.setAttribute('class', 'rec_show');
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('width', wd);
                rect.setAttribute('height', ht);
                rect.setAttribute('fill', color);

                //mousemove event on rect element
                $(rect).mousemove(function (event) {
                    rectangle = document.getElementById('svgtext_' + event.currentTarget.id.split('_')[1]);
                    if (rectangle == null) {
                        rectangle = document.getElementById('svgtext_' + event.currentTarget.id.split('_10')[1]);
                    }

                    $("#tip_" + scope.$id).text("Name: " + rectangle.textContent + " X:" + event.pageX + ", Y:" + event.pageY);
                    document.getElementById('svgrec_' + event.target.id.split('_')[1]).style.opacity = "0.5";
                    scope.updateToolTipPosition(y, ht, event);
                });

                //mouseenter event on rect element
                $(rect).mouseenter(function (event) {
                    rectangle = document.getElementById('svgtext_' + event.target.id.split('_')[1]);
                    if (rectangle == null) {
                        rectangle = document.getElementById('svgtext_' + event.currentTarget.id.split('_10')[1]);
                    }
                    $("#tip_" + scope.$id).text("Name: " + rectangle.textContent + " X:" + event.pageX + ", Y:" + event.pageY);
                    scope.updateToolTipPosition(y, ht, event);
                });

                //mouseleave event on rect element
                $(rect).mouseleave(function (event) {
                    document.getElementById('svgrec_' + event.target.id.split('_')[1]).style.opacity = "1"
                    $("#tip_" + scope.$id).hide()
                });
                document.getElementById('svgMultiBarChartContainer_' + scope.$id).appendChild(rect);
            };
            //Draw Markers on the X Axis
            scope.drawXAxisMarkers = function (svgChartHeight) {
                for (var i = 0; i < scope.totalChartBars; i++) {
                    // debugger
                    const remain = scope.totalChartBars - 1;
                    const index = remain - 2 * i;
                    if (index > 0) {
                        const name = scope.chartDataList[index][scope.xAxisItemsKey];
                        markerXPosition = 2 * scope.padding + ((2 * scope.barSize - 8) / 2) + i * 2 * scope.barSize;
                        markerYPosition = scope.padding + svgChartHeight + 15;

                        textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                        textElement.setAttribute('id', 'svgtext_' + 2 * i + scope.$id);
                        textElement.setAttribute('dx', markerXPosition);
                        textElement.setAttribute('dy', markerYPosition)
                        textElement.setAttribute('font-size', 'smaller');
                        textElement.setAttribute('text-anchor', 'middle');
                        txtNode = document.createTextNode(name);
                        textElement.appendChild(txtNode);
                        document.getElementById('svgMultiBarChartContainer_' + scope.$id).appendChild(textElement);
                    }
                }

                //Get the scroll parent and scroll value
                var scrolledNode = scope.getScrollParent($('#svgMultiBarparentdiv_' + scope.$id)[0]);
                scope.scrolledNode = scrolledNode;
                scope.scrollableParentId = (scrolledNode.id !== undefined ? scrolledNode.id : "");
                scope.scrollHeight = (scrolledNode.scrollHeight !== undefined ? scrolledNode.scrollHeight : "");
                scope.clientHeight = (scrolledNode.clientHeight !== undefined ? scrolledNode.clientHeight : "");
                if (scope.hasScroll) {
                    scope.setScrollTop();
                }

            };
            //Ends Here

            scope.buildToolTipElement = function () {
                if (!this.popoverEl) {
                    this.popoverTpl = '<span id=tip_' + scope.$id + '></span>';

                    this.popoverEl = $compile(this.popoverTpl)(scope);
                    // $("#svgMultiBarparentdiv_" + scope.$id).append(this.popoverEl);
                    $("body").append(this.popoverEl);
                }
            };
            scope.updateToolTipPosition = function (y, ht, event) {
                if (!this.popoverEl) {
                    scope.buildToolTipElement();
                }
                scope.getScroll();
                var xPosition = event.pageX + 30;
                var yPosition = event.pageY;
                yPosition = yPosition - scope.svgObj.toolTipHeight - 10;
                var el = document.getElementsByClassName("barscrollparentclass_" + scope.$id);
                scope.hasScroll = $(el).attr("hasscroll");

                if (scope.hasScroll) {
                    var parentOffset = parseInt($(el)[0].offsetParent == 'undefined' ? 0 : $(el)[0].offsetParent.offsetTop);
                    div = document.getElementById(scope.scrolledNode.id);
                    xposition=event.pageX+30;
                    if (parentOffset + div.offsetTop + scope.svgObj.toolTipHeight > event.pageY) {
                        yPosition = parentOffset + div.offsetTop;
                    }
                    // if (div.clientWidth + div.offsetLeft < event.pageX+30 + scope.svgObj.toolTipWeight) {
                        if (scope.lastWidth + div.offsetLeft < event.pageX+30 + scope.svgObj.toolTipWeight) {
                       // xPosition = div.offsetWidth + div.offsetLeft - (2 * scope.svgObj.toolTipWeight) - (div.offsetWidth - div.clientWidth);
                       xPosition = xposition - (2 * scope.svgObj.toolTipWeight) ;
                      //  debugger
                    }
                }
                else {
                    div = document.getElementById("svgMultiBarparentdiv_" + scope.$id);
                    var parentOffset = parseInt($(div)[0].offsetParent == 'undefined' ? 0 : $(div)[0].offsetParent.offsetTop);

                    if (parentOffset + div.offsetTop + scope.svgObj.toolTipHeight > event.pageY) {

                        yPosition = parentOffset + div.offsetTop + scope.svgObj.padding;
                        xPosition = event.pageX + 30;
                    }
                    if (parentOffset + div.offsetTop + event.offsetY + scope.svgObj.toolTipHeight < event.pageY) {

                        yPosition = parentOffset + div.offsetTop + event.offsetY - scope.svgObj.toolTipHeight;
                    }
                    if (event.offsetX + 30 + scope.svgObj.toolTipWeight > scope.lastWidth) {

                        xPosition = xPosition - (2 * scope.svgObj.toolTipWeight);
                    }
                }

                this.popoverEl
                    .css({
                        'left': xPosition + 'px',
                        'top': yPosition + 'px',
                        'height': scope.svgObj.toolTipHeight + 'px',
                        'width': scope.svgObj.toolTipWeight + 'px',
                        'background-color': 'white',
                        'border': '1px solid blue',
                        'position': 'absolute',
                        'font-size': '11px',
                        'font-family': 'Segoe UI',
                        'position': 'absolute'
                    });

                $("#tip_" + scope.$id).show()
            };
            scope.updateToolTipPosition_test = function (y, ht, event) {
                if (!this.popoverEl) {
                    scope.buildToolTipElement();
                }
                scope.getScroll();
                var xposition = event.pageX;
                var yposition = event.pageY;
                var chartWidth = $('#svgMultiBarChartContainer_' + scope.$id).outerWidth();
                var offset = $("#svgMultiBarparentdiv_" + scope.$id).parent().offset();
                const maxPos = Math.max(xposition) + scope.svgObj.toolTipWeight;

                xposition = xposition - offset.left;

                yposition = $('#svgMultiBarChartContainer_' + scope.$id).height() - (2 * scope.svgObj.padding) - ht - (scope.svgObj.toolTipHeight / 2);

                if (parseInt(event.currentTarget.attributes.y.value) <= scope.svgObj.toolTipHeight) {
                    yposition = $('#svgMultiBarChartContainer_' + scope.$id).height() - (2 * scope.svgObj.padding) - ht + scope.chartScrollTop;
                    console.log($('#svgMultiBarChartContainer_' + scope.$id).height() + '-' + scope.chartScrollTop);
                }

                this.popoverEl
                    .css({
                        'left': xposition + 'px',
                        'top': yposition + 'px',
                        'height': scope.svgObj.toolTipHeight + 'px',
                        'width': scope.svgObj.toolTipWeight + 'px',
                        'background-color': 'white',
                        'border': '1px solid blue',
                        'position': 'absolute',
                        'font-size': '11px',
                        'font-family': 'Segoe UI',
                        'display': 'block'
                    });

                if (chartWidth <= maxPos) {
                    this.popoverEl
                        .css({
                            'left': xposition - scope.svgObj.toolTipWeight + 'px'
                        });
                    console.log(this.popoverEl);
                }
                $("#tip_" + scope.$id).show()
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
                        $(node).attr('id', 'barscrollparentid_' + scope.$id);
                    }
                    const scrollLeft = $("#" + node.id).scrollLeft();
                    const scrollTop = $("#" + node.id).scrollTop();
                    if ((node.scrollHeight - node.clientHeight) > 0) {
                        scope.chartScrollTop = ((scrollTop !== undefined) ? scrollTop : 0);
                        scope.TotalScrollTop = ((node.scrollHeight - node.clientHeight) !== undefined ? (node.scrollHeight - node.clientHeight) : 0);
                        scope.hasScroll = true;
                        var el = document.getElementById(node.id);
                        if (el) {
                            el.className += el.className ? ' barscrollparentclass_' + scope.$id : ' barscrollparentclass_' + scope.$id;
                        }

                        $("#" + node.id).attr('hasScroll', 'true');
                    }
                    return node;
                }

                return scope.getScrollParent(node.parentNode) || document.body;
            };
            scope.setScrollTop = function () {
                if (scope.scrollableParentId !== "") {
                    $('#' + scope.scrollableParentId).scrollTop(scope.scrollHeight - scope.clientHeight);
                }
            };
            scope.getScroll = function () {
                if (scope.scrollableParentId !== "") {
                    const scrollTop = $("#" + scope.scrollableParentId).scrollTop();
                    scope.chartScrollTop = (scrollTop !== undefined ? scrollTop : 0);
                    scope.TotalScrollTop = ((scope.scrollHeight - scope.clientHeight) !== undefined ? (scope.scrollHeight - scope.clientHeight) : 0);
                }
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
        template: '<div style="position: relative; width: 100%;" id="svgMultiBarparentdiv_{{$id}}"> <svg id="svgMultiBarChartContainer_{{$id}}" height="256" width="100%"></svg> </div>'
    };
});
