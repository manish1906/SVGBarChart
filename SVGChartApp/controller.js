var app = angular.module("SVGBarChart", []);
app.controller("SVGBarChartController", function ($scope) {
    console.log("controller");
        $scope.initChart = function () {
            //$scope.chartDataList = [
            //    { name: 'a', value: 100, "lastUpdated": new Date("2019-06-03 02:01:10") },
            //    { name: 'b', value: 33, "lastUpdated": new Date("2019-06-03 02:01:20") },
            //    { name: 'c', value: 10, "lastUpdated": new Date("2019-06-02 02:01:30") },
            //    { name: 'd', value: 13, "lastUpdated": new Date("2019-06-02 02:01:40") },
            //    { name: 'e', value: 22, "lastUpdated": new Date("2019-06-02 02:01:50") },
            //    { name: 'l', value: 22, "lastUpdated": new Date("2019-06-10 02:03:12") },
            //    { name: 'f', value: 20, "lastUpdated": new Date("2019-06-01 02:02:59") },
            //    { name: 'g', value: 50, "lastUpdated": new Date("2019-06-01 02:02:45") },
            //    { name: 'h', value: 22, "lastUpdated": new Date("2019-06-04 02:02:40") },
            //    { name: 'i', value: 23, "lastUpdated": new Date("2019-06-05 02:02:32") },
            //    { name: 'j', value: 21, "lastUpdated": new Date("2019-01-06 02:03:10") },
            //    { name: 'k', value: 23, "lastUpdated": new Date("2019-06-06 02:03:12") },
            //    { name: 'M', value: 50, "lastUpdated": new Date("2019-08-03 02:01:10") },
            //    { name: 'N', value: 55, "lastUpdated": new Date("2019-04-03 02:01:20") },
            //    { name: 'O', value: 15, "lastUpdated": new Date("2019-02-02 02:01:30") },
            //    { name: 'P', value: 35, "lastUpdated": new Date("2019-04-02 02:01:40") },
            //    { name: 'Q', value: 25, "lastUpdated": new Date("2019-09-02 02:01:50") },
            //    { name: 'R', value: 45, "lastUpdated": new Date("2019-02-10 02:03:12") },
            //    { name: 's', value: 22, "lastUpdated": new Date("2019-11-01 02:02:59") },
            //    { name: 't', value: 23, "lastUpdated": new Date("2019-12-01 02:02:45") },
            //    { name: 'u', value: 21, "lastUpdated": new Date("2019-03-04 02:02:40") },
            //    { name: 'v', value: 23, "lastUpdated": new Date("2019-08-05 02:02:32") },
            //    { name: 'w', value: 22, "lastUpdated": new Date("2019-05-06 02:03:10") },
            //    { name: 'x', value: 50, "lastUpdated": new Date("2019-06-06 02:03:11") },

            //];
            //$scope.chartDataList = [
            //    { name: 'a', value: 1000, "lastUpdated": new Date("2019-06-03 02:01:10") },
            //    { name: 'b', value: 250, "lastUpdated": new Date("2019-06-03 02:01:20") },
            //    { name: 'c', value: 100, "lastUpdated": new Date("2019-06-02 02:01:30") },
            //    { name: 'd', value: 1300, "lastUpdated": new Date("2019-06-02 02:01:40") },
            //    { name: 'e', value: 400, "lastUpdated": new Date("2019-06-02 02:01:50") },
            //    { name: 'l', value: 202, "lastUpdated": new Date("2019-06-10 02:03:12") },
            //    { name: 'f', value: 800, "lastUpdated": new Date("2019-06-01 02:02:59") },
            //    { name: 'g', value: 500, "lastUpdated": new Date("2019-06-01 02:02:45") },
            //    { name: 'h', value: 150, "lastUpdated": new Date("2019-06-04 02:02:40") },
            //    { name: 'i', value: 230, "lastUpdated": new Date("2019-06-05 02:02:32") },
            //    { name: 'j', value: 210, "lastUpdated": new Date("2019-01-06 02:03:10") },
            //    { name: 'k', value: 700, "lastUpdated": new Date("2019-06-06 02:03:12") },
            //    { name: 'M', value: 110, "lastUpdated": new Date("2019-08-03 02:01:10") },
            //    { name: 'N', value: 550, "lastUpdated": new Date("2019-04-03 02:01:20") },
            //    { name: 'O', value: 120, "lastUpdated": new Date("2019-02-02 02:01:30") },
            //    { name: 'P', value: 180, "lastUpdated": new Date("2019-04-02 02:01:40") },
            //    { name: 'Q', value: 250, "lastUpdated": new Date("2019-09-02 02:01:50") },
            //    { name: 'R', value: 450, "lastUpdated": new Date("2019-02-10 02:03:12") },
            //    { name: 's', value: 220, "lastUpdated": new Date("2019-11-01 02:02:59") },
            //    { name: 't', value: 230, "lastUpdated": new Date("2019-12-01 02:02:45") },
            //    { name: 'u', value: 210, "lastUpdated": new Date("2019-03-04 02:02:40") },
            //    { name: 'v', value: 230, "lastUpdated": new Date("2019-08-05 02:02:32") },
            //    { name: 'w', value: 220, "lastUpdated": new Date("2019-05-06 02:03:10") },
            //    { name: 'x', value: 500, "lastUpdated": new Date("2019-06-06 02:03:11") },



            //]
            $scope.chartDataList = [
                { surname: '06 Jun', value: 100, "lastUpdated": new Date("2019-06-03 02:01:10") },
                { surname: '06 Jun', value: 100, "lastUpdated": new Date("2019-06-03 02:01:10") },
                { surname: 'b', value: 80, "lastUpdated": new Date("2019-06-03 02:01:20") },
                { surname: 'c', value: 90, "lastUpdated": new Date("2019-06-02 02:01:30") },
                { surname: 'd', value: 75, "lastUpdated": new Date("2019-06-02 02:01:40") },
                { surname: 'e', value: 78, "lastUpdated": new Date("2019-06-02 02:01:50") },
                { surname: 'l', value: 22, "lastUpdated": new Date("2019-06-10 02:03:12") },
                { surname: 'f', value: 20, "lastUpdated": new Date("2019-06-01 02:02:59") },
                { surname: 'g', value: 50, "lastUpdated": new Date("2019-06-01 02:02:45") },
                { surname: 'h', value: 22, "lastUpdated": new Date("2019-06-04 02:02:40") },
                { surname: 'i', value: 23, "lastUpdated": new Date("2019-06-05 02:02:32") },
                { surname: 'j', value: 21, "lastUpdated": new Date("2019-01-06 02:03:10") },
                { surname: 'k', value: 23, "lastUpdated": new Date("2019-06-06 02:03:12") },
                { surname: '03 Aug', value: 100, "lastUpdated": new Date("2019-08-03 02:01:10") },
                { surname: 'N', value: 55, "lastUpdated": new Date("2019-04-03 02:01:20") },
                { surname: 'O', value: 15, "lastUpdated": new Date("2019-02-02 02:01:30") },
                { surname: 'P', value: 35, "lastUpdated": new Date("2019-04-02 02:01:40") },
                { surname: 'Q', value: 25, "lastUpdated": new Date("2019-09-02 02:01:50") },
                { surname: 'R', value: 45, "lastUpdated": new Date("2019-02-10 02:03:12") },
                { surname: 's', value: 22, "lastUpdated": new Date("2019-11-01 02:02:59") },
                { surname: '01 Dec', value: 23, "lastUpdated": new Date("2019-12-01 02:02:45") },
                { surname: 'u', value: 21, "lastUpdated": new Date("2019-03-04 02:02:40") },
                { surname: 'v', value: 23, "lastUpdated": new Date("2019-08-05 02:02:32") },
                { surname: 'w', value: 22, "lastUpdated": new Date("2019-05-06 02:03:10") },
                { surname: 'x', value: 50, "lastUpdated": new Date("2019-06-06 02:03:11") },

    ]
    };
    $scope.state = false;               // Set the default tooltip state

    $scope.showTip = function () {
        $scope.state = true;
    };

    $scope.hideTip = function () {
        $scope.state = false;
    };
    
    });
