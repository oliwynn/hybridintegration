var app = new Vue({
    el: '#app',
    data: {
        products: [{
            name: 1
        }, {
            name: 2
        }, {
            name: 3
        }, {
            name: 4
        }, {
            name: 5
        }, {
            name: 6
        }, {
            name: 7
        }, {
            name: 8
        }, {
            name: 9
        }]
    },
    methods: {
        getWeather: function() {
            fetchWeather(this.value)
        }
    }
})

function fetchWeather(geo) {
    weatherAPI("/api/forecast/daily", {
        geocode: geo,
        units: "m",
        language: "en"
    }, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data.forecasts) {
                console.log(data.forecasts);
            } else {
                console.log('error!!!');
            }
        }
    });
}


function weatherAPI(path, qs, done) {
    $.ajax({
        url: path,
        type: 'GET',
        contentType: 'application/json',
        data: qs,
        success: function(data) {
            if (data.message == 401) {
                try {
                    data.data = JSON.parse(data.data);
                } catch (e) {}
                done(data);
            } else {
                done(null, data);
            }
        },
        error: function(xhr, textStatus, thrownError) {
            done(textStatus);
        }
    });
}

var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var geo = position.coords.latitude + ',' + position.coords.longitude;
    console.log(geo);
    fetchWeather(geo);
}
getLocation();