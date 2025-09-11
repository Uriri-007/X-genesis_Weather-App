//IIFE for accessing DOM elements
const Domaccess = (() => {
    const bodyElem = document.querySelector("body");
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
    const toggleUnitElem = document.querySelector(".switch");
    const allMetricDivs = document.querySelectorAll(".metric");
    const allImperialDivs = document.querySelectorAll(".imperial");
    return {
        bodyElem,
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
        maxTempSpan,
        toggleUnitElem,
        allMetricDivs,
        allImperialDivs
    };
})();

const DomCreation = (() => {
    const createdImgArr = [];
    const checkmarkImg = document.createElement("img");
    checkmarkImg.src = "./assets/images/icon-checkmark.svg";
    for (let i = 0; i < Domaccess.allImperialDivs.length; i++) {
        const duplicatedImg = checkmarkImg.cloneNode(true);
        createdImgArr.push(duplicatedImg);
    }
    return {
        createdImgArr
    };
})();
let isMetric = true;

//Verify the user input
function getValidUserData(string) {
    if (!string) {
        console.error("Place name cannot be empty");
        return;
    }
    return string.trim();
}
//Logic for toggling between metric and imperial units
function toggleUnit() {
    if (isMetric) {
        //Imperial mode
        isMetric = !isMetric;
        showSelectedUnits(isMetric);
    } else {
        //Back to metric mode
        isMetric = !isMetric;
        showSelectedUnits(isMetric);
    }
}

function showSelectedUnits(isSelected) {
    if (!isSelected) {
        setTimeout(function () {
            Domaccess.allMetricDivs.forEach((div, index) => {
                div.classList.remove("selected-unit");
                div.removeChild(DomCreation.createdImgArr[index]);
            });
            Domaccess.allImperialDivs.forEach((div, index) => {
                div.classList.add("selected-unit");
                div.appendChild(DomCreation.createdImgArr[index]);
            });
        }, 300);
    } else {
        setTimeout(function () {
            Domaccess.allImperialDivs.forEach((div, index) => {
                div.classList.remove("selected-unit");
                div.removeChild(DomCreation.createdImgArr[index]);
            });
            Domaccess.allMetricDivs.forEach((div, index) => {
                div.classList.add("selected-unit");
                div.appendChild(DomCreation.createdImgArr[index]);
            });
        }, 300);
    }

    setTimeout(function () {
        Domaccess.toggleUnitElem.textContent = `Switch to ${
            isMetric ? "Imperial" : "Metric"
        }`;
    }, 300);
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
        const coordinatesObj = roughCoordinates.results[0];
        return coordinatesObj;
    } catch (error) {
        console.error("Error fetching data: " + error);
    }
}
async function getWeatherData() {
    const coordinatesObj = await geoCodeUserData();
    //Configure the API for metric and imperial units
    let rawWeatherData;
    if (isMetric) {
        rawWeatherData = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coordinatesObj.latitude}&longitude=${coordinatesObj.longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code&current=wind_speed_10m,is_day,precipitation,relative_humidity_2m,temperature_2m,apparent_temperature,weather_code&timezone=auto`,
            { mode: "cors" }
        );
    } else {
        rawWeatherData = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coordinatesObj.latitude}&longitude=${coordinatesObj.longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code&current=wind_speed_10m,is_day,precipitation,relative_humidity_2m,temperature_2m,apparent_temperature,weather_code&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`,
            { mode: "cors" }
        );
    }
    const roughData = await rawWeatherData.json();
    console.log(roughData);
    organizeRawData(roughData);
}
function organizeRawData(object) {
    const { current_units: currentUnits, current, daily } = object;
    updateUI(currentUnits, current, daily);
}

//Updating the user interface
function updateUI(units, todays, daily) {
    Domaccess.cityDiv.textContent = Domaccess.cityNameInput.value;
    const todaysData = [
        Math.floor(todays.apparent_temperature) + "°",
        todays.relative_humidity_2m + units.relative_humidity_2m,
        todays.wind_speed_10m + " " + units.wind_speed_10m,
        todays.precipitation + " " + units.precipitation
    ];
    const dailyValue = [
        daily.time,
        Math.floor(daily.temperature_2m_min),
        Math.floor(daily.temperature_2m_max),
        daily.weather_code
    ];
    Domaccess.maxTempSpan.textContent = Math.floor(todays.temperature_2m) + "°";
    Domaccess.todayIconImg.src = getSuitableIcon(todays.weather_code);
    Domaccess.cityNameInput.value = "";
    Domaccess.cityNameInput.blur();
    todaysData.forEach((data, index) => {
        Domaccess.todaysDataSpans[index].textContent = data;
    });
}
function getCurrentDate() {
    const date = new Date();
    const weekDay = date.getDay();
    const monthDay = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    return days[weekDay] + ", " + months[month] + " " + monthDay + ", " + year;
}
function getSuitableIcon(weatherCode) {
    if ([0, 1].some(code => code === weatherCode)) {
        return "./assets/images/icon-sunny.webp";
    } else if ([2].some(code => code === weatherCode)) {
        return "./assets/images/icon-partly-cloudy.webp";
    } else if ([3].some(code => code === weatherCode)) {
        return "./assets/images/icon-overcast.webp";
    } else if ([45, 48].some(code => code === weatherCode)) {
        return "./assets/images/icon-fog.webp";
    } else if ([51, 53, 55, 56, 57, 80].some(code => code === weatherCode)) {
        return "./assets/images/icon-drizzle.webp";
    } else if (
        [61, 63, 65, 66, 67, 81, 82].some(code => code === weatherCode)
    ) {
        return "./assets/images/icon-rain.webp";
    } else if ([71, 73, 75, 77, 85, 86].some(code => code === weatherCode)) {
        return "./assets/images/icon-snow.webp";
    } else if ([95, 96, 99].some(code => code === weatherCode)) {
        return "./assets/images/icon-storm.webp";
    } else {
        return "./assets/images/icon-overcast.webp";
    }
}
function showLoadingStates() {}
function dropdownConversion() {
    const conversionBox = Domaccess.toggleUnitElem.parentElement;
    conversionBox.classList.toggle("drop");
}
document.addEventListener("DOMContentLoaded", () => {
    if (innerWidth > 1000) {
        Domaccess.blueImgDiv.style.cssText = `background-image: url('./assets/images/bg-today-large.svg')`;
    } else {
        Domaccess.blueImgDiv.style.cssText = `background-image: url('./assets/images/bg-today-small.svg')`;
    }
    Domaccess.dateSpan.textContent = getCurrentDate();
    Domaccess.allMetricDivs.forEach((div, index) => {
        div.classList.add("selected-unit");
        div.appendChild(DomCreation.createdImgArr[index]);
    });
});
Domaccess.searchBtn.addEventListener("click", () => getWeatherData());
Domaccess.cityNameInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        getWeatherData();
        return;
    }
});
Domaccess.dropDowns[0].addEventListener("click", () => dropdownConversion());
Domaccess.toggleUnitElem.addEventListener("click", () => toggleUnit());

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            },
            error => {
                console.error(`Error getting location: ${error.message}`);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}
