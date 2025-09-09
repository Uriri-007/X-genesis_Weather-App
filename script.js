//IIFE for accessing DOM elements
(function Domaccess() {
  const  dropDowns  = document.querySelectorAll(".select-box")
  const cityNameInput = document.querySelector("#city_name")
  const searchBtn = document.querySelector("#search_btn")
  return {
    
  }
})()

//Open Meteo APIs
//—Weather API: https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=wind_speed_10m,snowfall,showers,rain,is_day,precipitation,relative_humidity_2m,temperature_2m&timezone=auto
//—Geocoding api: https://geocoding-api.open-meteo.com/v1/search?name=Berlin