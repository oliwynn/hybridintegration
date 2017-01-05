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
            weatherAPI("/api/forecast/daily", {
                geocode: "51.51,0.13",
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
    }
})


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
/*
weatherAPI("/api/forecast/daily", {
    geocode: geocode,
    units: units,
    language: language
}, function(err, data) {
    if (err) {
        showError('#daily_throbber', '#daily_error', '#daily_display', err);
    } else {
        if (data.forecasts) {
            showDisplay('#daily_throbber', '#daily_error', '#daily_display');
            displayDaily(data);
        } else {
            showError('#daily_throbber', '#daily_error', '#daily_display', "Data missing");
        }
    }
});
*/