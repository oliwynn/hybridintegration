/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

//request module
var request = require('request');

// create a new express server
var app = express();

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
var weather_host = appEnv.services["weatherinsights"] ?
    appEnv.services["weatherinsights"][0].credentials.url // Weather credentials passed in
    :
    "https://2fd74174-e8c3-4817-bcdd-96accabb2d12:Hl0xDwAkUz@twcservice.eu-gb.mybluemix.net"; // or copy your credentials url here for standalone

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.get('/api', function(req, res) {
    res.send('Hello from the threads API');
});

function weatherAPI(path, qs, done) {
    var url = weather_host + path;
    console.log(url, qs);
    request({
        url: url,
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Accept": "application/json"
        },
        qs: qs
    }, function(err, req, data) {
        if (err) {
            done(err);
        } else {
            if (req.statusCode >= 200 && req.statusCode < 400) {
                try {
                    done(null, JSON.parse(data));
                } catch (e) {
                    console.log(e);
                    done(e);
                }
            } else {
                console.log(err);
                done({
                    message: req.statusCode,
                    data: data
                });
            }
        }
    });
}

app.get('/api/forecast/daily', function(req, res) {
    var geocode = (req.query.geocode || "45.43,-75.68").split(",");
    weatherAPI("/api/weather/v1/geocode/" + geocode[0] + "/" + geocode[1] + "/forecast/daily/3day.json", {
        units: req.query.units || "m",
        language: req.query.language || "en"
    }, function(err, result) {
        if (err) {
            console.log(err);
            res.send(err).status(400);
        } else {
            console.log("10 days Forecast");
            res.json(result);
        }
    });
});

app.get('/api/products', function(req, res) {
    request({
        url: 'https://api.eu.apiconnect.ibmcloud.com/edmundsheeukibmcom-apic-demo/threads/products/v1/product',
        method: "GET",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Accept": "application/json"
        }
    }, function(err, req, data) {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        }
    });
})

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});