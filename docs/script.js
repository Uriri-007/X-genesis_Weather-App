//Import Domaccess and DomCreation
import { Domaccess, DomCreation } from "./dom.js";

//Verify the user input
function getValidUserData(string) {
    if (!string) {
        console.error("Place name cannot be empty");
        return;
    }
    return string.trim();
}

//Logic for toggling between metric and imperial units
let isMetric = true;
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
                div.removeChild(DomCreation.checkmarkImgArr[index]);
            });
            Domaccess.allImperialDivs.forEach((div, index) => {
                div.classList.add("selected-unit");
                div.appendChild(DomCreation.checkmarkImgArr[index]);
            });
        }, 300);
    } else {
        setTimeout(function () {
            Domaccess.allImperialDivs.forEach((div, index) => {
                div.classList.remove("selected-unit");
                div.removeChild(DomCreation.checkmarkImgArr[index]);
            });
            Domaccess.allMetricDivs.forEach((div, index) => {
                div.classList.add("selected-unit");
                div.appendChild(DomCreation.checkmarkImgArr[index]);
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
async function getWeatherData(lat, long) {
    let rawWeatherData;
    if (lat === undefined && long === undefined) {
        const coordinatesObj = await geoCodeUserData();
        //Configure the API for metric and imperial units
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
    } else {
        //Fetch data using the user browser's coordinates
        if (isMetric) {
            rawWeatherData = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code&current=wind_speed_10m,is_day,precipitation,relative_humidity_2m,temperature_2m,apparent_temperature,weather_code&timezone=auto`,
                { mode: "cors" }
            );
        } else {
            rawWeatherData = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code&current=wind_speed_10m,is_day,precipitation,relative_humidity_2m,temperature_2m,apparent_temperature,weather_code&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`,
                { mode: "cors" }
            );
        }
    }
    const roughData = await rawWeatherData.json();
    console.log(roughData);
    organizeRawData(roughData);
}

//Updating the user interface
function organizeRawData(object) {
    const { current_units: currentUnits, current, daily, hourly } = object;
    updateUI(currentUnits, current, daily, hourly);
}
function updateUI(units, current, daily, hourly) {
    const currentData = [
        Math.floor(current.apparent_temperature) + "°",
        current.relative_humidity_2m + units.relative_humidity_2m,
        current.wind_speed_10m + " " + units.wind_speed_10m,
        current.precipitation + " " + units.precipitation
    ];
    const {
        time: dailyDates,
        temperature_2m_min: dailyMinTemp,
        temperature_2m_max: dailyMaxTemp,
        weather_code: dailyWeatherCode
    } = daily;
    const currentTime = current.time;
    const {
        time,
        temperature_2m: hourlyTemp,
        weather_code: hourlyWeatherCode
    } = hourly;
    const sevenDaysTime = sliceArrIntoSub(time, 24);
    const sevenDaysTemp = sliceArrIntoSub(hourlyTemp, 24)
    const sevenDaysCode = sliceArrIntoSub(hourlyWeatherCode, 24)
    const liveTimeArr = sevenDaysTime.find(arr => {
        const reArrangedCurrentTime = `${currentTime.split(":")[0]}:00`;
        return arr.includes(reArrangedCurrentTime);
    });
    const nowHrIndex = liveTimeArr.findIndex(time => {
      const reArrangedCurrentTime = `${currentTime.split(":")[0]}:00`;
      return time === reArrangedCurrentTime
    })
    const nowAndNextHrArr = liveTimeArr.slice(nowHrIndex)
    const nowIndex = sevenDaysTime.findIndex(arr => arr[0] === liveTimeArr[0])
    const liveTempArr = sevenDaysTemp[nowIndex]
    const nowAndNextTempArr = liveTempArr.slice(nowHrIndex)
    const liveCodeArr = sevenDaysCode[nowIndex]
    const nowAndNextCodeArr = liveCodeArr.slice(nowHrIndex)
    nowAndNextHrArr.forEach((time, index) => {
       const hour = time.split("T")[1].split(":")[0]
       const dayHrTempDiv = document.createElement("div")
       const iconTimeDiv = document.createElement("div")
       const hrIconImg = document.createElement("img")
       const hrSpan = document.createElement("span")
       const hrTemp = document.createElement("span")
       Domaccess.eightHrsDiv.appendChild(dayHrTempDiv)
       iconTimeDiv.appendChild(hrIconImg)
       iconTimeDiv.appendChild(hrSpan)
       dayHrTempDiv.appendChild(iconTimeDiv)
       dayHrTempDiv.appendChild(hrTemp)
       iconTimeDiv.classList.add("icon-and-time")
       hrIconImg.classList.add("hour-icon")
       hrSpan.classList.add("hour")
       hrTemp.classList.add("hour-temp")
       hrIconImg.src = getSuitableIcon(nowAndNextCodeArr[index])
       hrSpan.textContent = renderTime(hour)
       hrTemp.textContent = `${Math.floor(nowAndNextTempArr[index])}°`
     })
    
    Domaccess.loadingDiv.style.display = "none";
    Domaccess.cityDiv.textContent = !Domaccess.cityNameInput.value
        ? "Your Current Location"
        : Domaccess.cityNameInput.value;
    Domaccess.maxTempSpan.textContent = Math.floor(current.temperature_2m) + "°";
    DomCreation.currentIconImg.src = getSuitableIcon(current.weather_code);
    Domaccess.maxTempSpanParent.appendChild(DomCreation.currentIconImg);
    Domaccess.cityNameInput.value = "";
    Domaccess.cityNameInput.blur();
    Domaccess.todaysDataSpans.forEach((span, index) => {
        span.textContent = currentData[index];
    });
    DomCreation.dailyDateArr.forEach((dayH, index) => {
        const dateObj = new Date(dailyDates[index]);
        const fullDateArr = dateObj.toString().split(" ");
        dayH.textContent = fullDateArr[0];
        Domaccess.alldayAndIconDiv[index].appendChild(dayH);
    });
    DomCreation.dailyIconArr.forEach((img, index) => {
        img.src = getSuitableIcon(dailyWeatherCode[index]);
        Domaccess.alldayAndIconDiv[index].appendChild(img);
    });
    DomCreation.maxTempArr.forEach((span, index) => {
        span.textContent = Math.floor(dailyMaxTemp[index]) + "°";
        Domaccess.allMinMaxTempDiv[index].appendChild(span);
    });
    DomCreation.minTempArr.forEach((span, index) => {
        span.textContent = Math.floor(dailyMinTemp[index]) + "°";
        Domaccess.allMinMaxTempDiv[index].appendChild(span);
    });
}
function sliceArrIntoSub(arr, subSize) {
    const subArr = [];
    for (let i = 0; i < arr.length; i += subSize) {
        const shallowCopy = arr.slice(i, i + subSize);
        subArr.push(shallowCopy);
    }
    return subArr;
}
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                getWeatherData(latitude, longitude);
            },
            error => {
                console.error(`Error getting location: ${error.message}`);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
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
function renderTime(time) {
  if (time > 12) {
    return `${time % 12} PM`
  } else if(time === 12) {
    return `${time} PM`
  } else {
    return `${time * 1} AM`
  }
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
function showLoadingStates() {
    Domaccess.loadingDiv.style.display = "flex";
    Domaccess.allMinMaxTempDiv.forEach(div => {
        div.innerHTML = "";
    });
    Domaccess.alldayAndIconDiv.forEach(div => {
        div.innerHTML = "";
    });
    Domaccess.todaysDataSpans.forEach(span => {
        span.innerText = "—";
    });
    Domaccess.eightHrsDiv.innerHTML = ""
}
function dropdownConversion() {
    const conversionBox = Domaccess.toggleUnitElem.parentElement;
    conversionBox.classList.toggle("drop");
}
document.addEventListener("DOMContentLoaded", () => {
    if (innerWidth > 1000) {
        Domaccess.blueImgDiv.style.cssText = `background-image: url("./assets/images/bg-today-large.svg")`;
    } else {
        Domaccess.blueImgDiv.style.cssText = `background-image: url("./assets/images/bg-today-small.svg")`;
    }
    Domaccess.dateSpan.textContent = getCurrentDate();
    Domaccess.allMetricDivs.forEach((div, index) => {
        div.classList.add("selected-unit");
        div.appendChild(DomCreation.checkmarkImgArr[index]);
    });
    getCurrentLocation();
});
Domaccess.searchBtn.addEventListener("click", () => {
    showLoadingStates();
    getWeatherData();
    return
});
Domaccess.cityNameInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        showLoadingStates();
        getWeatherData();
        return;
    }
});
Domaccess.dropDowns[0].addEventListener("click", () => dropdownConversion());
Domaccess.toggleUnitElem.addEventListener("click", () => toggleUnit());

/*
For the daily unit values, add some other values e.g uv, is_day...
and set the grid to a max of 2 rows
*/
