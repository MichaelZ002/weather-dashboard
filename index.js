let APIkey = "8ce74caf8f9fa27fa1199d79630b9a36";
let dateToday = moment().format('L');

let cards = $(".card")

$(document).ready(function () {

    function getFutureCast() {
        let queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + APIkey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            cards.show()

            for (let i = 0; i < 5; i++) {
                let add = i + 1
                let thisAjax = response.daily[i]
                let cardDiv = $("#card" + i)
                let temp = $("<div>").text("Temp: " + Math.round(((thisAjax.temp.day - 273.15) * 1.8 + 32) * 10) / 10 + "F");
                let date = $("<h5>").text(moment().add(add, 'day').format('MM/DD/YYYY'));
                let weather = $("<img>");

                cardDiv.append(date, temp, weather);
            }
        })
    }
    //this will save places that you have searbed before into local storage 
    function updateLocalStorage(city) {
        pastSearches = city
        localStorage.setItem('pastSearches', pastSearches)
    }
    //wil display them
    function pullLocalStorage(city) {
        pastCitySearch = localStorage.getItem('pastSearches')
        let searches = $('<div>');
        searches.attr('class', 'past-searches')
        searches.text(pastCitySearch);
        $('#past-searches').prepend(searches);
    };

    function getCurrentWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
        let UVdiv = ('<div>')
        $('.card').empty()
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            $("#city-disp").text(response.name + "(" + dateToday + ")")
            let temp = Math.round(((response.main.temp - 273.15) * 1.8 + 32) * 10) / 10
            $("#temp").text("Temperature: " + temp)


            lon = response.coord.lon
            lat = response.coord.lat
            console.log(cityName)
        })
        updateLocalStorage(cityName)
        pullLocalStorage(cityName);
        setTimeout(function () {
            getFutureCast();
        },
            200);
    }

    $(document).on('click', '.btn', function (event) {
        event.preventDefault();
        let cityName = $("input").val()
        cityName = cityName.toUpperCase()
        getCurrentWeather(cityName)
    })

    $(document).on('click', '.past-searches', function (event) {
        event.preventDefault();
        let pastCitySearch = $(this).text();
        console.log(pastCitySearch)
        getCurrentWeather(pastCitySearch)
    });

    pullLocalStorage();

})