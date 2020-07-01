'use strict';
var appChartDirective = angular.module('app-chart.directive', []);
appChartDirective.directive('canvasBarChart', function ($filter) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            chartDataItem: '=items',
            xAxisItemsKey: '@xaxisitemskey',
            yAxisItemsKey: '@yaxisitemskey',
            orderByKey: '@orderbykey'
        },
        link: function (scope, elem) {
            var $destroy = scope.$on("$destroy", function () {
                $destroy();
                $destroy = null;
                chartWatch();
                chartWatch = null;
                $(elem).off();
                $(elem).detach();
                elem = null;
                scope = null;
            });
            scope.TotalScrollTop = 0;
            scope.chartscrollTop = 0;
            scope.hasscroll = false;
            scope.dotslist = [];
            scope.scrollableparentid = "";
            scope.scrollHeight = 0;
            scope.clientHeight = 0;

            var chartWatch = scope.$watch(
                "canvasBarChart",
                function handleBarChartDraw(v) {
                    scope.width = $("#baCanvas").parent().width();
                    scope.height = $("#baCanvas").height();
                    scope.draw(scope, $filter);
                }
            );

            $(window).resize(function () {
                scope.width = $("#baCanvas").parent().width();
                scope.height = $("#baCanvas").height();
                scope.draw(scope, $filter);
                if ($('#bacanvastip').length) {
                    $('#bacanvastip').remove();
                };

            });

            scope.draw = function (scope, filter) {
                var dataobj = {
                    canvas: baCanvas,
                    seriesName: "",
                    padding: 20,
                    gridScale: 5,
                    gridColor: "#eeeeee",
                    data: filter('orderBy')(scope.chartDataItem, scope.orderByKey, true),
                    colors: ["#1f75fe", "#1f75fe", "#1f75fe", "#1f75fe"],
                    defaultcolor: "#5DADEC"
                };
                //debugger;
                scope.dots = [];
                scope.options = dataobj;
                scope.padding = scope.options.padding;
                scope.maxValue = 0;
                this.canvas = scope.options.canvas;
                this.canvasContext = this.canvas.getContext("2d");
                this.colors = scope.options.colors;
                //set scroll top
                var node = $('#baCanvas')[0].parentNode;
                scope.scrollTop = node.scrollHeight - node.clientHeight;
                $('#' + node.id).scrollTop(scope.scrollTop);

                if (typeof scope.height !== 'undefined' && typeof scope.width !== 'undefined') {
                    this.canvas.height = parseInt(scope.height);
                    this.canvas.width = scope.width;
                }

                if (scope.options.data.length === 0) {
                    scope.maxValue = 14;
                }
                for (var i = 0; i < scope.options.data.length; i++) {
                    scope.maxValue = Math.max(scope.maxValue, scope.options.data[i][scope.yAxisItemsKey]);
                }
                debugger
                var canvasActualHeight = this.canvas.height - scope.options.padding * 2;
                var canvasActualWidth = this.canvas.width - scope.options.padding * 2;
                scope.drawYAxisLine(canvasActualHeight);
                scope.drawBarOnXAxis(canvasActualHeight, canvasActualWidth, filter);

                //Bar chart title names
                this.canvasContext.save();
                this.canvasContext.textBaseline = "bottom";
                this.canvasContext.textAlign = "center";
                this.canvasContext.fillStyle = "#000000";
                this.canvasContext.font = "bold 8px Arial";
                this.canvasContext.fillText(scope.options.seriesName, this.canvas.width / 2, this.canvas.height);

                this.canvasContext.lineWidth = 1;
                this.canvasContext.stroke();
                this.canvasContext.restore();
                scope.getScroll();

            };

            scope.drawBarOnXAxis = function (canvasActualHeight, canvasActualWidth, filter) {
                //Draw Bars
                scope.barIndex = 0; scope.numberOfBars = 0;
                scope.barwidth = 50;
                scope.dataList = scope.options.data.length;
                scope.numberOfBars = Math.round(canvasActualWidth / scope.barwidth);
                scope.remainNumberOfBars = scope.numberOfBars - scope.dataList;
                var ListOfBars = [];
                scope.options.data = $filter('limitTo')(scope.options.data, scope.numberOfBars, 0);

                for (var k = 0; k < scope.options.data.length; k++) {
                    ListOfBars.push({
                        "itemname": scope.options.data[k][scope.xAxisItemsKey]
                        , "itemvalue": scope.options.data[k][scope.yAxisItemsKey]
                        , "itemindex": scope.numberOfBars - k
                    });
                };

                scope.barSize = scope.barwidth;
                for (var j = 0; j < scope.remainNumberOfBars; j++) {
                    ListOfBars.push({
                        "itemname": "0"
                        , "itemvalue": "0"
                        , "itemindex": scope.remainNumberOfBars - j
                    });
                }
                ListOfBars = filter('orderBy')(ListOfBars, "itemindex");

                //get scrollable first parent and scroll top value
                var scrollednode = scope.getScrollParent($('#baCanvas')[0]);
                scope.scrollableparentid = (scrollednode.id !== undefined ? scrollednode.id : "");
                scope.scrollHeight = (scrollednode.scrollHeight !== undefined ? scrollednode.scrollHeight : "");
                scope.clientHeight = (scrollednode.clientHeight !== undefined ? scrollednode.clientHeight : "");

                if (scope.hasscroll) {
                    scope.setScrollTop();
                }
                //debugger;
                for (var i = 0; i < ListOfBars.length; i++) {
                    var val = ListOfBars[i]["itemvalue"];
                    var title = ListOfBars[i]["itemname"];
                    var barHeight = Math.round(canvasActualHeight * val / scope.maxValue);
                    scope.drawChartBar(
                        this.canvasContext,
                        scope.options.padding + scope.barIndex * scope.barSize,
                        this.canvas.height - barHeight - scope.options.padding,
                        scope.barSize - 8,
                        barHeight,
                        //this.defaultcolor,
                        this.colors[scope.barIndex % this.colors.length],
                        title,
                        val
                    );
                    scope.barIndex++;
                }
            };

            scope.drawYAxisLine = function (canvasActualHeight) {
                //Y axis lines populate
                var yAxisValue = 0;
                while (yAxisValue <= scope.maxValue) {
                    var yAxis = canvasActualHeight * (1 - yAxisValue / scope.maxValue) + scope.options.padding;
                    scope.drawLine(
                        this.canvasContext,
                        0,
                        yAxis,
                        this.canvas.width,
                        yAxis,
                        scope.options.gridColor
                    );

                    this.canvasContext.save();
                    this.canvasContext.textBaseline = "bottom";
                    this.canvasContext.font = "bold 8px Arial";
                    this.canvasContext.fillText(yAxisValue, 5, yAxis + 4 - 0);
                    this.canvasContext.restore();

                    yAxisValue += scope.options.gridScale;
                }
            };

            scope.drawLine = function (canvasContext, color) {
                canvasContext.save();
                canvasContext.strokeStyle = color;
                canvasContext.beginPath();
                canvasContext.stroke();
                canvasContext.restore();
            };

            scope.drawChartBar = function (canvasContext, upperAxisX, upperAxisY, width, height, color, title, value) {
                canvasContext.save();
                canvasContext.fillStyle = color;
                var offset = $(scope.options.canvas).parent().offset();
                canvasContext.fillRect(upperAxisX, upperAxisY, Math.round(width), height);
                scope.dots.push({
                    x1: upperAxisX + (offset.left !== undefined ? offset.left : 0),
                    y1: upperAxisY + (offset.top !== undefined ? offset.top : 0) - scope.scrollTop,//+ (scope.hasscroll === false ? 20 : 0),
                    x2: width + upperAxisX + (offset.left !== undefined ? offset.left : 0),
                    y2: height + upperAxisY + (offset.top !== undefined ? offset.top : 0),// - scope.chartscrollTop,// + (scope.hasscroll === false ? 20 : 0),
                    w: width,
                    h: height,
                    ydisvalue: value,
                    xdisvalue: title,
                    color: "red",
                    tip: "#text" + (value + 1)
                });

                canvasContext.lineWidth = 2;
                canvasContext.strokeStyle = '#333';
                canvasContext.font = 'solid 0pt';
                canvasContext.textAlign = "center";
                canvasContext.restore();
                canvasContext.fillText(title, upperAxisX + width - (width / 2), upperAxisY + height + 11);
                canvasContext.textAlign = "center";
                canvasContext.restore();
            };

            scope.setScrollTop = function () {
                if (scope.scrollableparentid !== "") {
                    $('#' + scope.scrollableparentid).scrollTop(scope.scrollHeight - scope.clientHeight);
                }
            };

            scope.setToolTip = function (event) {
                scope.getScroll();
                var offset = $('#baCanvas').parent().offset();
                var arrx = [];
                var arry = [];
                arrx = $.grep(scope.dotslist, function (n, i) {
                    return (n.x1 <= event.pageX && n.x2 >= event.pageX);
                });
                arry = $.grep(arrx, function (n, i) {
                    return (n.y1 <= event.pageY && n.y2 >= event.pageY);
                });
                // Draw Tool-Tip canvas dynamically
                if ($('#bacanvastip').length) {
                    $('#bacanvastip').remove();
                };
                if (arry.length > 0) {
                    var tipCanvasSize = {
                        Width: 100,
                        Height: 25
                    };
                    var xposition = event.pageX - offset.left + 5;
                    var yposition = event.pageY;
                    var newCanvas = $('<canvas/>', {
                        'class': 'barcss',
                        id: 'bacanvastip'
                    }).prop({
                        width: tipCanvasSize.Width,
                        height: tipCanvasSize.Height
                    });
                    $('#parentcanvasdiv').append(newCanvas);

                    var tipcanvas = document.getElementById("bacanvastip");
                    tipcanvas.style.position = "absolute";
                    tipcanvas.style.backgroundColor = "white";
                    tipcanvas.style.border = "1px solid #1f75fe";
                    if (event.pageX + tipCanvasSize.Width > (this.width - (scope.padding * 2))) {
                        xposition = arry[0].x1 - offset.left - (scope.padding * 4);
                    }

                    yposition = arry[0].y1 - offset.top - 30;
                    var barheight = (arry[0].y2 - arry[0].y1);
                    if (barheight + tipCanvasSize.Height + scope.padding + scope.TotalScrollTop > this.canvas.height) {
                        yposition = arry[0].y1 - offset.top + 40;
                    }

                    var tipCanvas = document.getElementById("bacanvastip");
                    var tipCtx = tipCanvas.getContext("2d");
                    var tipstr = "Name:" + arry[0].xdisvalue
                        + " X:" + (event.pageX) + " Y:" + (event.pageY);
                    tipCanvas.style.left = xposition + "px";
                    tipCanvas.style.top = yposition + "px";
                    tipCtx.clearRect(0, 0, tipCanvas.width, tipCanvas.height);
                    tipCtx.fillText(tipstr, 5, 15);
                }
                // end Tool-Tip canvas
            };

            scope.getScrollParent = function (node) {
                const isElement = node instanceof HTMLElement;
                const overflowY = isElement && window.getComputedStyle(node).overflowY;
                const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';
                if (!node) {
                    return null;
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

            scope.getScroll = function () {
                if (scope.scrollableparentid !== "") {
                    const scrollTop = $("#" + scope.scrollableparentid).scrollTop();
                    scope.chartscrollTop = (scrollTop !== undefined ? scrollTop : 0);
                    scope.TotalScrollTop = ((scope.scrollHeight - scope.clientHeight) !== undefined ? (scope.scrollHeight - scope.clientHeight) : 0);
                }
                scope.dotslist = [];
                $.each(scope.dots, function (index, value) {
                    scope.dotslist.push({
                        x1: value.x1,
                        y1: value.y1 + (scope.TotalScrollTop - scope.chartscrollTop),
                        x2: value.x2,
                        y2: value.y2 + (scope.TotalScrollTop - scope.chartscrollTop),
                        w: value.w,
                        h: value.h,
                        ydisvalue: value.ydisvalue,
                        xdisvalue: value.xdisvalue,
                        color: value.color,
                        tip: value.tip
                    });
                });
            };

            $("#baCanvas").mousemove(function (event) {
                scope.setToolTip(event);
            });

            $("#baCanvas").mouseleave(function (event) {
                if ($('#bacanvastip').length) {
                    $('#bacanvastip').remove();
                };
            });
        },
        template: '<div style="position: relative; width: 100%;" id="parentcanvasdiv"> <canvas id="baCanvas" style="background: white;display: block; padding: 0;margin: 0 auto; max-width: 100%;height: 256px;"> </canvas> </div>  '
    };
});


