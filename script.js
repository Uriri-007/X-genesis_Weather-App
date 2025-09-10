//IIFE for accessing DOM elements
const Domaccess = (() => {
    const dropDowns = document.querySelectorAll(".select-box");
    const cityNameInput = document.querySelector("#city_name");
    const searchBtn = document.querySelector("#search_btn");
    const blueImgDiv = document.querySelector(".image-data");
    const todaysDataSpans = document.querySelectorAll(".present-value");
    const nextSevenDaysDivs = document.querySelectorAll(".daily-value > div");
    const nextEightHrsDivs = document.querySelectorAll(".eight-hrs-data");
    const cityDiv = document.querySelector(".place-name");
    const dateSpan = document.querySelector(".current-date");
    const todayIconImg = document.querySelector(".today-icon");
    const maxTempSpan = document.querySelector(".max-temp");
    /*const  = document.querySelector("")
  const  = document.querySelector("")*/
    return {
        dropDowns,
        cityNameInput,
        searchBtn,
        blueImgDiv,
        todaysDataSpans,
        nextSevenDaysDivs,
        nextEightHrsDivs,
        cityDiv,
        dateSpan,
        todayIconImg,
        maxTempSpan
    };
})();
let isMetric = false;

//Verify the user input
function getValidUserData(string) {
    if (!string) {
        console.error("Place name cannot be empty");
        return;
    }
    return string.trim();
}

//Asynchronous functions for fetching data from Open Meteo APIs
async function geoCodeUserData() {
    const cityName = getValidUserData(Domaccess.cityNameInput.value);
    try {
        const rawCoordinates = await fetch(
            "https://geocoding-api.open-meteo.com/v1/search?name=" + cityName,
            { mode: "cors" }
        );
        const roughCoordinates = await rawCoordinates.json();
        const coordinatesArray = roughCoordinates.results[0];
        return coordinatesArray;
    } catch (error) {
        console.error("Error fetching data: " + error);
    }
}
async function getWeatherData() {
    const coordinatesArray = await geoCodeUserData();
    //Configure the API for metric and imperial units
    let rawWeatherData;
    if (isMetric) {
        rawWeatherData = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coordinatesArray.latitude}&longitude=${coordinatesArray.longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=wind_speed_10m,is_day,precipitation,relative_humidity_2m,temperature_2m,apparent_temperature&timezone=auto`,
            { mode: "cors" }
        );
    } else {
        rawWeatherData = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coordinatesArray.latitude}&longitude=${coordinatesArray.longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=wind_speed_10m,is_day,precipitation,relative_humidity_2m,temperature_2m,apparent_temperature&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`,
            { mode: "cors" }
        );
    }
    console.log(rawWeatherData);
    const roughData = await rawWeatherData.json();
    console.log(roughData);
    organizeRawData(roughData);
}
function organizeRawData(object) {
    const { current } = object;
    updateUI(current);
}
function updateUI(todays) {
    const todaysData = [
        todays.apparent_temperature,
        todays.relative_humidity_2m,
        todays.wind_speed_10m,
        todays.precipitation
    ];
    todaysData.forEach((data, index) => {
        Domaccess.todaysDataSpans[index].textContent = data;
        Domaccess.maxTempSpan.textContent = todays.temperature_2m;
    });
}

function showLoadingStates() {}

Domaccess.searchBtn.addEventListener("click", () => {
    console.log(true);
    getWeatherData();
});
document.addEventListener("DOMContentLoaded", () => {
    if (innerWidth > 1000) {
        Domaccess.blueImgDiv.style.cssText = `background-image: url('./assets/images/bg-today-large.svg')`;
    } else {
        Domaccess.blueImgDiv.style.cssText = `background-image: url('./assets/images/bg-today-small.svg')`;
    }
});
