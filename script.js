//IIFE for accessing DOM elements
const Domaccess = (() => {
  const  dropDowns  = document.querySelectorAll(".select-box")
  const cityNameInput = document.querySelector("#city_name")
  const searchBtn = document.querySelector("#search_btn")
  const blueImgDiv = document.querySelector(".image-data")
  const todaysDataDivs = document.querySelectorAll(".present-data > div")
  const nextSevenDaysDivs = document.querySelectorAll(".daily-value > div")
  const nextEightHrsDivs = document.querySelectorAll(".eight-hrs-data")
  /*const  = document.querySelector("")
  const  = document.querySelector("")
  const  = document.querySelector("")
  const  = document.querySelector("")
  const  = document.querySelector("")
  const  = document.querySelector("")*/
  return {
    dropDowns,
    cityNameInput,
    searchBtn,
    blueImgDiv,
    todaysDataDivs,
    nextSevenDaysDivs,
    nextEightHrsDivs
  }
})()

function getValidUserData(string) {
  if(!string) {
    console.error("Place name cannot be empty")
    return
  }
    return string.trim()
}

async function geoCodeUserData() {
  const cityName = getValidUserData(Domaccess.cityNameInput.value)
  return fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + cityName, { mode: "cors" })
}
async function getCoordinates() {
  const rawCoordinates = await geoCodeUserData()
  const roughCoordinates = await rawCoordinates.json()
  console.log(roughCoordinates)
}

Domaccess.searchBtn.addEventListener("click", () => getCoordinates)

//Open Meteo APIs
//—Weather API: https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=wind_speed_10m,snowfall,showers,rain,is_day,precipitation,relative_humidity_2m,temperature_2m&timezone=auto
//—Geocoding api: 
document.addEventListener("DOMContentLoaded", () => {
  if(innerWidth > 1000) {
    Domaccess.blueImgDiv.style.cssText = `background-image: url('./assets/images/bg-today-large.svg')`
  } else {
    Domaccess.blueImgDiv.style.cssText = `background-image: url('./assets/images/bg-today-small.svg')`
  }
})