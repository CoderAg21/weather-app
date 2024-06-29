//global scope
let searchArea = document.getElementById("searchArea");
let searchContent = document.querySelector(".searchContent");
let currentDayTemp = document.querySelector(".currentDayTemp");
let cTime = document.querySelector(".cTime");
let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let cDate = document.querySelector('.cDate');
let cDay = document.querySelector('.cDay');
let nextDayDetails = document.querySelector(".nextDayDetails");
let areaName = document.querySelector(".areaName");
let weatherDetails = document.querySelector('.weatherDetails')
let cel = document.getElementById("celcius");
let far = document.getElementById('farheneit');
let celVal = 37;
let farVal = undefined;
cel.style.background = "rgba(255,255,0,0.6)";
let manyClocks = document.querySelector('.manyClocks')
let dayTime = [];
let dayTimeKey = ["Sunrise", "GMT+0530", "Sunset"];
let uvData = document.querySelector(".uvData");
let aqiData = document.querySelector(".aqiData");
let fewdata = document.querySelector(".fewdata");
let uvFeedback = ["Moderate", "High", "Very High", "Extreme"]


//Main logic starts here
// sugesstions for the search area
searchArea.addEventListener("input", () => {
    let p1 = new Promise((resolve, reject) => {
        let data1 = fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchArea.value}&count=10&language=en`)
        resolve(data1)
    })
    p1.then((val) => {
        return new Promise((resolve, reject) => {
            let readableData1 = val.json();
            resolve(readableData1)

        })

    }).then((response) => {
        searchContent.innerHTML = ''
        for (let i = 0; i < 10; i++) {

            // creating search element
            let itemElement = document.createElement("div");
            itemElement.classList.add("items", `${i + 1}`);
            try {
                itemElement.innerHTML = `${(response.results)[i].name} | ${(response.results)[i].country} |   <span style="font-size:10px;font-weight:bold ; background:#ebcfcf">&nbsp;&nbsp;Lat:${(response.results)[i].latitude} , Long:${(response.results)[i].longitude}</span>`
                searchContent.append(itemElement)
                
            } catch (error) {
                return; //nothing to do here
                
            }


            // adding event listener to each search result
            itemElement.addEventListener('click', () => {

                searchContent.innerHTML = '';
                // console.log((response.results)[i].name)
                let p2 = new Promise((resolve, reject) => {
                    let data2 = fetch(`https://api.open-meteo.com/v1/forecast?latitude=${(response.results)[i].latitude}&longitude=${(response.results)[i].longitude}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&&current=relative_humidity_2m,precipitation,rain,wind_speed_10m&daily=sunrise,sunset,daylight_duration,sunshine_duration&daily=uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum&timezone=auto`);
                    resolve(data2)

                });

                p2.then((val2) => {
                    return new Promise((resolve, reject) => {
                        let readableData2 = val2.json();
                        resolve(readableData2)

                    });

                }).then((response2) => {


                    let uvNewVal = Math.round(response2.daily.uv_index_max[0] / (15 / 4));
                    uvData.innerHTML = `<h6>UV Index: <br><center>${uvFeedback[uvNewVal - 1]}</center></h6>`


                    // console.log(uvNewVal);
                    if (uvNewVal == 1) {
                        uvData.classList.add("val1")

                    }
                    else if (uvNewVal == 2) {
                        uvData.classList.add("val2")

                    }
                    else if (uvNewVal == 3) {
                        uvData.classList.add("val3")

                    }
                    else {
                        uvData.classList.add("val4")

                    }


                    manyClocks.innerHTML = '';
                    dayTime.push(new Date(`${response2.daily.sunrise[0]}`));
                    dayTime.push(new Date())
                    dayTime.push(new Date(`${response2.daily.sunset[0]}`));
                    // console.log(dayTime)
                    for (let k = 1; k < 4; k++) {

                        // making all the clocks
                        let clock = document.createElement('div');
                        clock.classList.add("clock", `clock${k}`)
                        clock.innerHTML = `  <h3>${dayTimeKey[k - 1]}</h3>
                        <div class="hour hour${k}"></div>
                        <div class="minute minute${k}"></div>
                        <div class="second second${k}"></div>`;
                        manyClocks.append(clock)

                        function clockTime() {

                            hrotation = 30 * htime + mtime / 2;
                            mrotation = 6 * mtime;
                            srotation = 6 * stime;
                            // console.log(htime, mtime, stime, hrotation)

                            minute = document.querySelector(`.minute${k}`);
                            second = document.querySelector(`.second${k}`);
                            hour = document.querySelector(`.hour${k}`);

                            hour.style.transform = `rotate(${hrotation - 90}deg)`;
                            minute.style.transform = `rotate(${mrotation - 90}deg)`;
                            second.style.transform = `rotate(${srotation + 90}deg)`;
                        }



                        if (k != 2) {

                            htime = dayTime[k - 1].getHours();
                            mtime = dayTime[k - 1].getMinutes();
                            stime = dayTime[k - 1].getSeconds();
                            clockTime();


                        }


                        else {

                            // console.log(200)
                            setInterval(() => {

                                d = new Date;
                                htime = d.getHours();
                                mtime = d.getMinutes();
                                stime = d.getSeconds();
                                clockTime();


                            }, 1000);

                        }


                    }
                    // reset the dayTime array
                    dayTime = [];



                    // DOM manipulation
                    currentDayTemp.innerHTML = `${response2.current.temperature_2m}<sup class="superscript">&deg;C</sup>`
                    celVal = response2.current.temperature_2m;
                    farVal = 32 + (9 / 5) * celVal;
                    cTime.innerText = `${(response2.current.time).slice(11, 16)}`;
                    cDay.innerText = `${String(new Date(`${(response2.current.time)}`)).slice(0, 3)}`
                    cDate.innerText = `${(response2.current.time).slice(8, 10)} ${month[Number.parseInt((response2.current.time).slice(5.7)) - 1]} '${(response2.current.time).slice(2, 4)}`;
                    areaName.innerText = (response.results)[i].name;



                    //current weather details showing for the searched region
                    weatherDetails.innerHTML = '';  //first clear the previous data
                    weatherDetails.innerHTML = `  <div class="windSpeed"><img id="weatherIcon" alt=""
                            src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather02-512.png"> Wind: 
                        <span class="windData">${response2.current.wind_speed_10m} km/h</span>
                    </div>

                    <div class="humidity">|<img id="weatherIcon" alt=""
                            src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather02-512.png"> Humidity: 
                        <span class="humidityData">${response2.current.relative_humidity_2m} mm</span>
                    </div>
                    
                    <div class="rain">|<img id="weatherIcon" alt=""
                    src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather02-512.png"> Rain: 
                    <span class="raindDta">${response2.current.rain} mm</span>
                    </div>`;



                    // Future days weather details showing of the searchedd region.
                    nextDayDetails.innerHTML = ''; // first clear the previous data
                    for (let j = 1; j < 6; j++) {
                        let nextDaysContainer = document.createElement('div');
                        nextDaysContainer.classList.add('nextDaysContainer');

                        nextDaysContainer.innerHTML = ` <div class="nextDaysTemp">${(response2.daily.temperature_2m_max)[j]}<sup             class="superscript">&deg;C</sup></div>
                        <div class="nextDaysIcon"><img
                        src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather02-512.png "
                        alt="" id=""></div>
                        <div class="nextDayName">${((response2.daily.time)[j]).slice(8, 10)} ${month[Number.parseInt((response2.daily.time)[j].slice(5.7)) - 1]} '${(response2.daily.time)[j].slice(2, 4)}
                        </div>`;

                        nextDayDetails.append(nextDaysContainer)
                        // console.log((response2.daily.temperature_2m_max)[j])

                    }


                })


                // fetching air quality index

                let p3 = new Promise((resolve, reject) => {
                    let data3 = fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${(response.results)[i].latitude}&longitude=${(response.results)[i].longitude}&current=european_aqi,us_aqi,pm10,pm2_5&timezone=auto`)
                    resolve(data3)

                })
                p3.then((val3) => {
                    return new Promise((resolve, reject) => {
                        let readableData3 = val3.json();
                        resolve(readableData3)

                    });

                }).then((response3) => {
                    // console.log(response2.daily.uv_index_max[0])
                    let aqiNewVal = (response3.current.us_aqi) / 125
                    //console.log(aqiNewVal)


                    aqiData.innerHTML = `<h6>AQI: ${response3.current.us_aqi}</h6>`;


                    // console.log(uvNewVal);
                    if (aqiNewVal <= 1) {
                        aqiData.classList.add("val1")

                    }
                    else if (aqiNewVal <= 2) {
                        aqiData.classList.add("val2")

                    }
                    else if (aqiNewVal <= 3) {
                        aqiData.classList.add("val3")

                    }
                    else {
                        aqiData.classList.add("val4")

                    }

                    //console.log(response3.current.us_aqi)
                })

            })



        }

    })

});




// adding method to convert degree into farheneit and vice-versa
cel.addEventListener('click', () => {
    cel.style.background = "rgba(255,255,0,0.6)"
    far.style.background = "";
    if (farVal) {
        celVal = (farVal - 32) * (5 / 9)
        currentDayTemp.innerHTML = `${(celVal.toFixed(1))}<sup class="superscript">&deg;C</sup>`

    }
    else {
        return;
    }
})
far.addEventListener('click', () => {
    far.style.background = "rgba(255,255,0,0.6)"
    cel.style.background = "";
    if (celVal) {
        farVal = 32 + (9 / 5) * celVal;
        currentDayTemp.innerHTML = `${farVal.toFixed(1)}<sup class="superscript">&deg;F</sup>`
    }
    else {
        return;
    }
})
