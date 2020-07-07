'use strict';
barchartapp.controller('barchartController', function ($rootScope, $scope, $filter, $http) {
    $scope.initChart = function () {
        // $scope.chartDataList = [
        //     {
        //         surname: '06 Jun',
        //         value: 100,
        //         "lastUpdated": new Date('2019-06-03 02:01:10')
        //     },
        //     {
        //         surname: '06 Jun',
        //         value: 100,
        //         "lastUpdated": new Date("2019-06-03 02:01:10")
        //     },
        //     { surname: 'b', value: 80, "lastUpdated": new Date("2019-06-03 02:01:20") },
        //     { surname: 'c', value: 90, "lastUpdated": new Date("2019-06-02 02:01:30") },
        //     { surname: 'd', value: 75, "lastUpdated": new Date("2019-06-02 02:01:40") },
        //     { surname: 'e', value: 78, "lastUpdated": new Date("2019-06-02 02:01:50") },
        //     { surname: 'l', value: 22, "lastUpdated": new Date("2019-06-10 02:03:12") },
        //     { surname: 'f', value: 20, "lastUpdated": new Date("2019-06-01 02:02:59") },
        //     { surname: 'g', value: 50, "lastUpdated": new Date("2019-06-01 02:02:45") },
        //     { surname: 'h', value: 22, "lastUpdated": new Date("2019-06-04 02:02:40") },
        //     { surname: 'i', value: 23, "lastUpdated": new Date("2019-06-05 02:02:32") },
        //     { surname: 'j', value: 21, "lastUpdated": new Date("2019-01-06 02:03:10") },
        //     { surname: 'k', value: 23, "lastUpdated": new Date("2019-06-06 02:03:12") },
        //     {
        //         surname: '03 Aug',
        //         value: 100,
        //         "lastUpdated": new Date("2019-08-03 02:01:10")
        //     },
        //     { surname: 'N', value: 55, "lastUpdated": new Date("2019-04-03 02:01:20") },
        //     { surname: 'O', value: 15, "lastUpdated": new Date("2019-02-02 02:01:30") },
        //     { surname: 'P', value: 35, "lastUpdated": new Date("2019-04-02 02:01:40") },
        //     { surname: 'Q', value: 25, "lastUpdated": new Date("2019-09-02 02:01:50") },
        //     { surname: 'R', value: 45, "lastUpdated": new Date("2019-02-10 02:03:12") },
        //     { surname: 's', value: 22, "lastUpdated": new Date("2019-11-01 02:02:59") },
        //     {
        //         surname: '11 Dec',
        //         value: 23,
        //         "lastUpdated": new Date("2019-12-01 02:02:45")
        //     },
        //     { surname: 'u', value: 21, "lastUpdated": new Date("2019-03-04 02:02:40") },
        //     { surname: 'v', value: 23, "lastUpdated": new Date("2019-08-05 02:02:32") },
        //     { surname: 'w', value: 22, "lastUpdated": new Date("2019-05-06 02:03:10") },
        //     { surname: 'x', value: 50, "lastUpdated": new Date("2019-06-06 02:03:11") },
        //     { surname: 'a1', value: 55, "lastUpdated": new Date("2019-06-06 02:03:11") },
        //     { surname: 'b1', value: 15, "lastUpdated": new Date("2019-06-06 02:03:11") },
        //     { surname: 'c1', value: 35, "lastUpdated": new Date("2019-06-06 02:03:11") },
        //     { surname: 'e1', value: 25, "lastUpdated": new Date("2019-06-06 02:03:11") },
        //     { surname: 'g1', value: 45, "lastUpdated": new Date("2019-06-06 02:03:11") },
        //     { surname: 'f1', value: 22, "lastUpdated": new Date("2019-06-06 02:03:11") },
        //     { surname: 'h1', value: 23, "lastUpdated": new Date("2019-06-06 02:03:11") },
        //     { surname: 't1', value: 21, "lastUpdated": new Date("2019-06-06 02:03:11") },
        //     { surname: 'j1', value: 23, "lastUpdated": new Date("2019-06-06 02:03:11") },
        //     { 
        //         surname: '02 Dec', 
        //         value: 22, 
        //         "lastUpdated": new Date("2019-06-06 02:03:11") 
        //     },
        //     { 
        //         surname: '31 Dec', 
        //         value: 23, 
        //         "lastUpdated": new Date("2019-12-01 02:02:45") 
        //     },
        //     { 
        //         surname: '03 Dec', 
        //         value: 21, 
        //         "lastUpdated": new Date("2019-03-04 02:02:40") 
        //     },
        //     { 
        //         surname: '011 Dec', 
        //         value: 23, 
        //         "lastUpdated": new Date("2019-08-05 02:02:32") 
        //     },
        //     { 
        //         surname: '21 Dec', 
        //         value: 22, 
        //         "lastUpdated": new Date("2019-05-06 02:03:10") 
        //     },
        //     { 
        //         surname: '05 Dec', 
        //         value: 50, 
        //         "lastUpdated": new Date("2019-06-06 02:03:11") 
        //     },
        //     { 
        //         surname: '01 jun', 
        //         value: 55, 
        //         "lastUpdated": new Date("2019-06-06 02:03:11") 
        //     },

        // ];
         $scope.chartDataList = [
               { surname: 'a', value: 100, "lastUpdated": new Date("2019-06-03 02:01:10") },
               { surname: 'b', value: 33, "lastUpdated": new Date("2019-06-03 02:01:20") },
               { surname: 'c', value: 10, "lastUpdated": new Date("2019-06-02 02:01:30") },
               { surname: 'd', value: 13, "lastUpdated": new Date("2019-06-02 02:01:40") },
               { surname: 'e', value: 22, "lastUpdated": new Date("2019-06-02 02:01:50") },
               { surname: 'l', value: 22, "lastUpdated": new Date("2019-06-10 02:03:12") },
               { surname: 'f', value: 20, "lastUpdated": new Date("2019-06-01 02:02:59") },
               { surname: 'g', value: 50, "lastUpdated": new Date("2019-06-01 02:02:45") },
               { surname: 'h', value: 22, "lastUpdated": new Date("2019-06-04 02:02:40") },
               { surname: 'i', value: 23, "lastUpdated": new Date("2019-06-05 02:02:32") },
               { surname: 'j', value: 21, "lastUpdated": new Date("2019-01-06 02:03:10") },
               { surname: 'k', value: 23, "lastUpdated": new Date("2019-06-06 02:03:12") },
               { surname: 'M', value: 50, "lastUpdated": new Date("2019-08-03 02:01:10") },
               { surname: 'N', value: 55, "lastUpdated": new Date("2019-04-03 02:01:20") },
               { surname: 'O', value: 15, "lastUpdated": new Date("2019-02-02 02:01:30") },
               { surname: 'P', value: 35, "lastUpdated": new Date("2019-04-02 02:01:40") },
               { surname: 'Q', value: 25, "lastUpdated": new Date("2019-09-02 02:01:50") },
               { surname: 'R', value: 45, "lastUpdated": new Date("2019-02-10 02:03:12") },
               { surname: 's', value: 22, "lastUpdated": new Date("2019-11-01 02:02:59") },
               { surname: 't', value: 23, "lastUpdated": new Date("2019-12-01 02:02:45") },
               { surname: 'u', value: 21, "lastUpdated": new Date("2019-03-04 02:02:40") },
               { surname: 'v', value: 23, "lastUpdated": new Date("2019-08-05 02:02:32") },
               { surname: 'w', value: 22, "lastUpdated": new Date("2019-05-06 02:03:10") },
               { surname: 'x', value: 50, "lastUpdated": new Date("2019-06-06 02:03:11") },

            ];
        //$scope.chartDataList = [];
        // debugger;
        //$scope.getdata(event);
        //function httpGetAsync(theUrl, callback) {
        //    $.ajax({
        //        url: theUrl,
        //        type: 'GET',
        //        contentType: 'application/json',
        //        headers: {
        //            'token_type': 'Bearer 8ab314a6a2f8e7e9f643ffc0b174a314160483bd'
        //        },
        //        success: function (result) {
        //            debugger;
        //            // CallBack(result);
        //        },
        //        error: function (error) {
        //            debugger;
        //            console.log(error);

        //        }
        //    });

        //var xmlHttp = new XMLHttpRequest();
        //xmlHttp.onreadystatechange = function () {
        //    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        //        debugger;
        //        //callback(xmlHttp.responseText);
        //}
        //xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        //xmlHttp.withCredentials = true;
        //xmlHttp.send({ 'request': "Authorization Bearer 8ab314a6a2f8e7e9f643ffc0b174a314160483bd" });
    }

    $scope.myFunc1 = function () {
        $scope.chartDataList = [
            { surname: 'O', value: 105, "lastUpdated": new Date("2019-02-02 02:01:30") },
            { surname: 'P', value: 305, "lastUpdated": new Date("2019-04-02 02:01:40") },
            { surname: 'Q', value: 205, "lastUpdated": new Date("2019-09-02 02:01:50") },
            { surname: 'R', value: 405, "lastUpdated": new Date("2019-02-10 02:03:12") },
            { surname: 's', value: 202, "lastUpdated": new Date("2019-11-01 02:02:59") },
            { 
                surname: '01 Dec', 
                value: 203, 
                "lastUpdated": new Date("2019-12-01 02:02:45") 
            },
            { surname: 'u', value: 201, "lastUpdated": new Date("2019-03-04 02:02:40") },
            { surname: 'v', value: 203, "lastUpdated": new Date("2019-08-05 02:02:32") },
            { surname: 'w', value: 202, "lastUpdated": new Date("2019-05-06 02:03:10") },
            { surname: 'x', value: 500, "lastUpdated": new Date("2019-06-06 02:03:11") },
        ];
        $rootScope.$broadcast('barchart-refresh');
        // $rootScope.$broadcast('PHOTO_UPLOADED', "photo");
    }

    $scope.myFunc2 = function () {
        $scope.chartDataList = [
            { surname: 'a1', value: 55, "lastUpdated": new Date("2019-10-06 02:03:11") },
            { surname: 'b1', value: 15, "lastUpdated": new Date("2019-08-06 02:03:11") },
            { surname: 'c1', value: 35, "lastUpdated": new Date("2019-06-06 02:03:11") },
            { surname: 'e1', value: 25, "lastUpdated": new Date("2019-06-06 02:03:11") },
            { surname: 'g1', value: 45, "lastUpdated": new Date("2019-06-06 02:03:11") },
            { surname: 'f1', value: 22, "lastUpdated": new Date("2019-06-06 04:03:11") },
            { surname: 'h1', value: 23, "lastUpdated": new Date("2019-06-06 03:03:11") },
            { surname: 't1', value: 21, "lastUpdated": new Date("2019-11-06 02:03:11") },
            { surname: 'j1', value: 23, "lastUpdated": new Date("2019-12-06 02:03:11") },
            { surname: 'u1', value: 22, "lastUpdated": new Date("2019-07-06 02:03:11") },

        ];
        $rootScope.$broadcast('barchart-refresh');
        // $rootScope.$broadcast('PHOTO_UPLOADED', "photo");
    }
    // httpGetAsync("https://github.com/dotnetdev19radixweb/wikitest/wiki", "wikitest");


    //https://stackoverflow.com/questions/48246333/get-rendered-html-wiki-page-using-the-github-api
    //https://stackoverflow.com/questions/14705726/github-api-and-access-control-allow-origin

    //function getPage(name, repo, file) {
    //    fetch(`https://github.com/${name}/${repo}/${file}`, { mode: 'cors' })
    //        .then(data => data.text())
    //        .then(data => {
    //            debugger;
    //            const parser = new DOMParser();
    //            const dataEl = parser.parseFromString(data, "text/html");
    //            const el = dataEl.querySelector(".wiki-body > .markdown-body");
    //            $.html(".content", el.innerHTML);
    //        });
    //}
    ////getPage("arguiot", "Glottologist", "wiki");
    ////getPage("BoardActive", "BAKit-API", "wiki");
    //getPage("dotnetdev19radixweb", "wikitest", "wiki");



    //function getPage(name, repo, file) {
    //    fetchJsonp(`https://github.com/${name}/${repo}/${file}`, { mode: 'cors' })
    //        .then(data => data.text())
    //        .then(data => {
    //            debugger;
    //            const parser = new DOMParser();
    //            const dataEl = parser.parseFromString(data, "text/html");
    //            const el = dataEl.querySelector(".wiki-body > .markdown-body");
    //            $.html(".content", el.innerHTML);
    //        });
    //}
    //getPage("BoardActive", "BAKit-API", "wiki");








    //var url = "https://en.wikipedia.org/w/api.php";

    //var params = {
    //    action: "query",
    //    format: "json",
    //    prop: "categories",
    //    titles: "Janelle Monáe"
    //};

    //url = url + "?origin=*";
    //Object.keys(params).forEach(function (key) { url += "&" + key + "=" + params[key]; });

    //fetch(url)
    //    .then(function (response) { return response.json(); })
    //    .then(function (response) {
    //        var pages = response.query.pages;
    //        for (var p in pages) {
    //            for (var cat of pages[p].categories) {
    //                console.log(cat.title);
    //            }
    //        }
    //    })
    //    .catch(function (error) { console.log(error); });


    //$scope.foo = function (response) {
    //    var meta = response.meta;
    //    var data = response.data;
    //    console.log(meta);
    //    console.log(data);
    //}
    //var ClientOAuth2 = require('client-oauth2')

    //var githubAuth = new ClientOAuth2({
    //    clientId: '414c5afb68bc81c06e77',
    //    clientSecret: '51de59fe817668442e4af923b3b6761aabe3b6f1',
    //    accessTokenUri: 'https://github.com/login/oauth/access_token',
    //    authorizationUri: 'https://github.com/login/oauth/authorize',
    //    redirectUri: 'http://localhost:59293?callback=foo',
    //    scopes: ['notifications', 'gist']
    //})
    //console.log(githubAuth);
    //};

    // $scope.getdata = function (event) {
    //     const wiki_API_URL = "https://github.com/BoardActive/BAKit-API/wiki/Home.md";
    //     var path = wiki_API_URL;

    //     $http({

    //         method: 'GET',

    //         url: wiki_API_URL,

    //         //data: 'parameters'

    //     }).then(function success(response) {
    //         debugger;

    //         // this function will be called when the request is success

    //     }, function error(response) {

    //         // this function will be called when the request returned error status

    //     });
    // };
});
