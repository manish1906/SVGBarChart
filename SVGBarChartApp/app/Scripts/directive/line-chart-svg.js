// const { codePointAt } = require("angular-route");



var appChartDirective = angular.module('app-chart.directive', []);
appChartDirective.directive("svgLineChart", function ($filter, $compile) {
    return {
        restrict: 'E',

        scope: {
            chartDataItem: '=items',
            xAxisItemsKey: '@xaxisitemskey',
            yAxisItemsKey: '@yaxisitemskey',
            orderByKey: '@orderbykey'
        },
        link: function (scope, element) {
          //  console.log(scope)
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
                if ($("#svgLineContainer_"+scope.$id).length > 0) {
                    $("#svgLineContainer_"+scope.$id).empty();
                }
                scope.drawLineChart();
            });

            //Function to specify Chart settings
            scope.drawLineChart = function () {
                scope.svgObj = {
                    padding: 25,
                    data: $filter('orderBy')(scope.chartDataItem, scope.orderByKey, true),
                    maximumDataValue: 100,
                    maxTicksLimit: 5,
                    toolTipHeight: 40,
                    toolTipWidth: 100
                };

                scope.padding = scope.svgObj.padding;
                scope.width = $("#svgLineContainer_"+scope.$id).parent().width();
                scope.height = $("#svgLineContainer_"+scope.$id).height();
                console.log("width"+scope.width)
                var svgChartWidth = scope.width - 2 * scope.padding;
                var svgChartHeight = scope.height - 2 * scope.padding;
                scope.chartDataList = scope.svgObj.data;
                scope.length = scope.chartDataList.length;

                //if you want to no add extra points at the start of chart then
                //then set true addExtraPoints else false false

                // addExtraPoints=false;
                // if(addExtraPoints){
                scope.dist=svgChartWidth/scope.length
             //   console.log(svgChartWidth/scope.length)
                scope.totalpoint=Math.floor( svgChartWidth/50);
               scope.chartDataList = $filter('limitTo')(scope.svgObj.data, scope.totalpoint, 0);

              //  Add point at left side if chart does not have sufficient point
                if (scope.totalpoint > scope.length) {
                    for (i = 0; i < scope.totalpoint - scope.length; i++) {
                        scope.chartDataList.push({ [scope.xAxisItemsKey]: "0", "value": "0", "index": length + i });

                    }
                }
              // }
           // console.log("total"+scope.totalpoint)

                //For X Axis
                scope.drawLine(scope.padding, svgChartHeight + scope.padding, svgChartWidth + scope.padding, svgChartHeight + scope.padding,2);
                //For Y Axis
                scope.drawLine(scope.padding, scope.padding, scope.padding, svgChartHeight + scope.padding,2);
                //For Y axis labels
                scope.drawYAxisMarkers(svgChartHeight, svgChartWidth);
                scope.drawChartWithCalculation(svgChartHeight, svgChartWidth);

            };
            //Ends Here


            //
            scope.drawLine = function (x1, y1, x2, y2, strokeWidth) {
                var dataAxis = document.createElementNS("http://www.w3.org/2000/svg", 'line');
                dataAxis.setAttribute("x1", x1);
                dataAxis.setAttribute("y1", y1);
                dataAxis.setAttribute("x2", x2);
                dataAxis.setAttribute("y2", y2);
                dataAxis.style.stroke = "black";
                dataAxis.style.strokeWidth = strokeWidth+"px";
                document.getElementById("svgLineContainer_"+scope.$id).appendChild(dataAxis);

            }

            //Function to Draw Markers on the Y Axis
            scope.drawYAxisMarkers = function (svgChartHeight,svgChartWidth) {
                //
                var labelOnYAxis = 0;
                var extensionnumber = 0;
                //Find maximum data value from given data
                scope.maxDataValue = scope.svgObj.maximumDataValue;
                for (var i = 0; i < scope.chartDataList.length; i++) {
                    scope.maxDataValue = Math.max(scope.maxDataValue, scope.chartDataList[i][scope.yAxisItemsKey]);
                }
                //var incrBy = scope.determineStepSize();
                var incrBy = Math.round(scope.maxDataValue / scope.svgObj.maxTicksLimit);

                while (labelOnYAxis <= (scope.maxDataValue + extensionnumber)) {
                    markerVal = labelOnYAxis;
                    var xMarkers = 0;
                    var yMarkers = svgChartHeight * (1 - markerVal / scope.maxDataValue) + scope.padding;
                    textelement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                    textelement.setAttribute('dx', xMarkers);
                    textelement.setAttribute('dy', yMarkers+5);
                    textelement.setAttribute('font-size', "smaller");
                    txtnode = document.createTextNode(markerVal);
                    textelement.appendChild(txtnode);

                    document.getElementById("svgLineContainer_"+scope.$id).appendChild(textelement);
                    labelOnYAxis = labelOnYAxis + incrBy;

                    //For draw horizontal line in the line chart background
                    scope.drawLine(scope.padding, yMarkers, svgChartWidth + scope.padding, yMarkers,0.5)
                }
            };
            //Ends Here

            //Function to draw linechart for all entries in the  Array
            scope.drawChartWithCalculation = function (svgChartHeight,svgChartWidth) {

                for (var i = 0; i < scope.totalpoint; i++) {
                    var remain = scope.totalpoint - 1;
                    scope.chartDataList[remain - i]["index"] = i;

                }
                // barChartX = 2 * scope.padding + i * scope.barSize;
                // markerXPosition = 2 * scope.padding + ((scope.barSize - 8) / 2) + i * scope.barSize;
               const points = scope.chartDataList
               .map(element => {
              // const x = (element.index / (scope.totalpoint-1)) * svgChartWidth + scope.padding;
               const x = (element.index *50) + scope.padding;
               const y = svgChartHeight - (element.value / scope.maxDataValue) *svgChartHeight + scope.padding;
               scope.drawCircleForChart(x, y,element.index);
               return `${x},${y}`;

             })
                    //.join(" ");
               //   console.log(points)
                var val1=points[1].split(",")[0];
                var val2=points[0].split(",")[0];
                var diff=val2-val1;
                console.log(diff)
                scope.drawXAxisMarkers(svgChartHeight, svgChartWidth);
                scope.drawLineForChart(points);

            };
            //Ends Here
            //Function to Draw Markers on the X Axis
            scope.drawXAxisMarkers = function (svgChartHeight, svgChartWidth) {
                for (var i = 0; i < scope.totalpoint; i++) {
                    var remain = scope.totalpoint - 1;
                    name = scope.chartDataList[remain - i].surname;
                 //     markerXPosition = scope.chartDataList[remain - i].index / (scope.totalpoint-1) * svgChartWidth + scope.padding;
                   markerXPosition =  (scope.chartDataList[remain - i].index *50) + scope.padding;
                    markerYPosition = scope.padding + svgChartHeight+15 ;
                    textelement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                    textelement.setAttribute('id', "text_"+i+scope.$id);
                    textelement.setAttribute('dx', markerXPosition);
                    textelement.setAttribute('dy', markerYPosition);
                    textelement.setAttribute('font-size', 'smaller');
                    txtnode = document.createTextNode(name);
                    textelement.appendChild(txtnode);
                    document.getElementById("svgLineContainer_"+scope.$id).appendChild(textelement);
              // console.log(markerXPosition)
                }
                  //Get the scroll parent and scroll value
                  var scrolledNode = scope.getScrollParent($('#svgLineParentdiv_' + scope.$id)[0]);

                  scope.scrolledNode = scrolledNode;
                  scope.scrollableParentId = (scrolledNode.id !== undefined ? scrolledNode.id : "");
                  scope.scrollHeight = (scrolledNode.scrollHeight !== undefined ? scrolledNode.scrollHeight : "");
                  scope.clientHeight = (scrolledNode.clientHeight !== undefined ? scrolledNode.clientHeight : "");

                  if (scope.hasScroll) {
                      scope.setScrollTop();
                  }
            };
            //Ends Here

            //Function to Draw Line for line chart
            scope.drawLineForChart = function (points) {
                var line = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
                line.setAttribute('stroke', 'blue');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('points', points);
                line.setAttribute('fill', "none ");

                document.getElementById("svgLineContainer_"+scope.$id).appendChild(line);
            };

             //Function to Draw circle at the start of the line
            scope.drawCircleForChart = function (x,y,index) {
                var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                circle.setAttribute('id', 'circle_' + index + scope.$id);
                circle.setAttribute('stroke', ' #0074d9');
                circle.setAttribute('stroke-width', '2');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
                circle.setAttribute('r', "4");
                circle.setAttribute('fill', "blue ");
                $(window).mousemove(function (event) {

                    $("p").text(" X:" + event.pageX + ", Y:" + event.pageY);

                 });
                $(circle).mousemove(function (event) {
                    var cir=document.getElementById("text_"+ event.target.id.split('_')[1]);
                    $("#tooltip_"+scope.$id).text("Name: "+cir.textContent+" X:" + event.pageX + ", Y:" + event.pageY);
                    scope.updateTooltipPosition();
                 });
                 $(circle).mouseenter(function (event) {
                    var cir=document.getElementById("text_"+ event.target.id.split('_')[1]);
                    $("#tooltip_"+scope.$id).text("Name:"+cir.textContent+" X:" + event.pageX + ", Y:" + event.pageY);
                    scope.updateTooltipPosition(x,event);
                 });
                 $(circle).mouseleave(function () {
                    $("#tooltip_"+scope.$id).slideUp();
                });
                document.getElementById("svgLineContainer_"+scope.$id).appendChild(circle);
            };

            scope.buildTooltip = function () {
                if (!this.popoverEl) {
                    this.popoverTpl = '<span id=tooltip_'+scope.$id+'></span>';

                    this.popoverEl = $compile(this.popoverTpl)(scope);
                    $("body").append(this.popoverEl);
                }
            };

            scope.updateTooltipPosition = function (x) {
                if (!this.popoverEl) {
                    scope.buildTooltip();
                }
            scope.getScroll();
            var xPosition = event.pageX + 30;
            var yPosition = event.pageY;

            yPosition = yPosition - scope.svgObj.toolTipHeight - 10;
            var el = document.getElementsByClassName("barscrollparentclass_" + scope.$id);
            scope.hasScroll = $(el).attr("hasscroll");

            if (scope.hasScroll) {
           //     debugger
                var parentOffset = parseInt($(el)[0].offsetParent == 'undefined' ? 0 : $(el)[0].offsetParent.offsetTop);
                div = document.getElementById(scope.scrolledNode.id);

                //if tooltip top of element then tooltip
                if (parentOffset + div.offsetTop + scope.svgObj.toolTipHeight > event.pageY) {
               //  debugger
                    yPosition = parentOffset + div.offsetTop;
                }
                if (div.clientWidth + div.offsetLeft < event.pageX + scope.svgObj.toolTipWidth) {
                 //debugger
                    xPosition = div.offsetWidth + div.offsetLeft - (2 * scope.svgObj.toolTipWidth) - (div.offsetWidth - div.clientWidth);
                }
            } else {
                div = document.getElementById("svgLineParentdiv_" + scope.$id);
                var parentOffset = parseInt($(div)[0].offsetParent == 'undefined' ? 0 : $(div)[0].offsetParent.offsetTop);
               // debugger
                if (parentOffset + div.offsetTop + scope.svgObj.toolTipHeight > event.pageY) {
                //   debugger
                    yPosition = parentOffset+ div.offsetTop + scope.svgObj.padding ;
                    xPosition = event.pageX + 50;
                }
                if (parentOffset + div.offsetTop + event.offsetY + scope.svgObj.toolTipHeight < event.pageY) {
                //    debugger
                    yPosition = parentOffset+ div.offsetTop + event.offsetY - scope.svgObj.toolTipHeight;
                }
                if (event.offsetX + scope.svgObj.toolTipWidth > scope.width) {
                //    debugger
                    xPosition = xPosition - (2 * scope.svgObj.toolTipWidth);
                }
            }

            this.popoverEl
                .css({
                    'left': xPosition + 'px',
                    'top': yPosition + 'px',
                    'height': scope.svgObj.toolTipHeight + 'px',
                    'width': scope.svgObj.toolTipWidth + 'px',
                    'background-color': 'white',
                    'border': '1px solid blue',
                    'position': 'absolute',
                    'font-size': '11px',
                    'font-family': 'Segoe UI',
                    'position': 'absolute'
                });

                $("span").show()
        };

            //Get the element which has scrollbar
            scope.getScrollParent = function (node) {

                const isElement = node instanceof HTMLElement;
                const overflowY = isElement && window.getComputedStyle(node).overflowY;
                const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

                if (!node) {
                    return null; 0
                } else if (isScrollable && node.scrollHeight >= node.clientHeight) {

                    if (angular.isUndefined(node.id) || node.id === "") {
                        debugger
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

            //For set scrollbar to top
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

        },
        template: '<div style="position: relative; width: 100%;" id="svgLineParentdiv_{{$id}}"> <svg id="svgLineContainer_{{$id}}" height="256" width="100%"></svg></div>'
    };
});
