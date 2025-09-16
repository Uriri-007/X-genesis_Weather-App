//IIFE for accessing DOM elements
const Domaccess = (() => {
    const bodyElem = document.querySelector("body");
    const dropDowns = document.querySelectorAll(".select-box");
    const cityNameInput = document.querySelector("#city_name");
    const searchBtn = document.querySelector("#search_btn");
    const blueImgDiv = document.querySelector(".image-data");
    const loadingDiv = document.querySelector(".loading")
    const todaysDataSpans = document.querySelectorAll(".present-value");
    const eightHrsDiv = document.querySelector(".eight-hrs-data");
    const cityDiv = document.querySelector(".place-name");
    const dateSpan = document.querySelector(".current-date");
    const maxTempSpan = document.querySelector(".max-temp");
    const maxTempSpanParent = document.querySelector(".icon-and-temp")
    const toggleUnitElem = document.querySelector(".switch");
    const allMetricDivs = document.querySelectorAll(".metric");
    const allImperialDivs = document.querySelectorAll(".imperial");
    const alldayAndIconDiv = document.querySelectorAll(".day-and-icon");
    const allMinMaxTempDiv = document.querySelectorAll(".min-and-max-temp");
    return {
        bodyElem,
        dropDowns,
        cityNameInput,
        searchBtn,
        blueImgDiv,
        loadingDiv,
        todaysDataSpans,
        eightHrsDiv,
        cityDiv,
        dateSpan,
        maxTempSpan,
        maxTempSpanParent,
        toggleUnitElem,
        allMetricDivs,
        allImperialDivs,
        alldayAndIconDiv,
        allMinMaxTempDiv
    };
})();

//IIFE for creating elements
const DomCreation = (() => {
    const checkmarkImgArr = [];
    const currentIconImg = document.createElement("img");
    currentIconImg.classList.add("today-icon")
    const checkmarkImg = document.createElement("img");
    checkmarkImg.src = "./assets/images/icon-checkmark.svg";
    for (let i = 0; i < Domaccess.allImperialDivs.length; i++) {
        const duplicatedImg = checkmarkImg.cloneNode(true);
        checkmarkImgArr.push(duplicatedImg);
    }
    
    const dailyIconArr = []
    const dailyIconImg = document.createElement("img")
    dailyIconImg.classList.add("week-days-icon")
    for (let i = 0; i < Domaccess.alldayAndIconDiv.length; i++) {
        const duplicatedImg = dailyIconImg.cloneNode(true);
         dailyIconArr.push(duplicatedImg);
    }
    
    const dailyDateArr = []
    const dailyDaysH2 = document.createElement("h2")
    dailyDaysH2.classList.add("week-days")
    for (let i = 0; i < Domaccess.alldayAndIconDiv.length; i++) {
        const duplicatedH2 = dailyDaysH2.cloneNode(true);
        dailyDateArr.push(duplicatedH2);
    }
    
    const minTempArr = []
    const minTempSpan = document.createElement("span")
    minTempSpan.classList.add("min")
    for (let i = 0; i < Domaccess.allMinMaxTempDiv.length; i++) {
        const duplicatedSpan = minTempSpan.cloneNode(true);
        minTempArr.push(duplicatedSpan);
    }
    
    const maxTempArr = []
    const maxTempSpan = document.createElement("span")
    maxTempSpan.classList.add("max")
    for (let i = 0; i < Domaccess.allMinMaxTempDiv.length; i++) {
        const duplicatedSpan = maxTempSpan.cloneNode(true);
        maxTempArr.push(duplicatedSpan);
    }
    
    //.hour-temp
    return {
        checkmarkImgArr,
        currentIconImg,
        dailyIconArr,
        dailyDateArr,
        minTempArr,
        maxTempArr
    };
})();

export { Domaccess, DomCreation }