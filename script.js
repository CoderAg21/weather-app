let searchArea = document.getElementById("searchArea");
let searchContent = document.querySelector(".searchContent");
let currentDayTemp = document.querySelector(".currentDayTemp");
let cTime = document.querySelector(".cTime");
let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let cDate = document.querySelector('.cDate');
let nextDayDetails = document.querySelector(".nextDayDetails");
let areaName = document.querySelector(".areaName");
let weatherDetails = document.querySelector('.weatherDetails')


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
            itemElement.innerHTML = `${(response.results)[i].name} | ${(response.results)[i].country} |   <span style="font-size:10px;font-weight:bold ; background:#ebcfcf">&nbsp;&nbsp;Lat:${(response.results)[i].latitude} , Long:${(response.results)[i].longitude}</span>`
            searchContent.append(itemElement)


            // adding event listener to each search result
            itemElement.addEventListener('click', () => {
                searchContent.innerHTML = '';
                // console.log((response.results)[i].name)
                let p2 = new Promise((resolve, reject) => {


                    let data2 = fetch(`https://api.open-meteo.com/v1/forecast?latitude=${(response.results)[i].latitude}&longitude=${(response.results)[i].longitude}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&&current=relative_humidity_2m,precipitation,rain,wind_speed_10m&timezone=auto`);
                    resolve(data2)

                });

                p2.then((val2) => {
                    return new Promise((resolve, reject) => {
                        let readableData2 = val2.json();
                        resolve(readableData2)

                    });

                }).then((response2) => {
                    // console.log(response2.current.temperature_2m)
                    // console.log(response2.current)
                    currentDayTemp.innerHTML = `${response2.current.temperature_2m}<sup class="superscript">&deg;C</sup>`
                    cTime.innerText = `${(response2.current.time).slice(11, 16)}`;
                    cDate.innerText = `${(response2.current.time).slice(8, 10)} ${month[Number.parseInt((response2.current.time).slice(5.7)) - 1]}' ${(response2.current.time).slice(2, 4)}`;
                    areaName.innerText = (response.results)[i].name;
                    nextDayDetails.innerHTML = '';
                    weatherDetails.innerHTML = '';


                    weatherDetails.innerHTML = `  <div class="windSpeed"><img id="weatherIcon" alt=""
                            src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather02-512.png"> Wind
                        <span class="windData">${response2.current.wind_speed_10m} km/h</span>
                    </div>

                    <div class="humidity">|<img id="weatherIcon" alt=""
                            src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather02-512.png"> Humidity
                        <span class="humidityData">${response2.current.relative_humidity_2m} mm</span>
                    </div>

                    <div class="rain">|<img id="weatherIcon" alt=""
                            src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather02-512.png"> Rain
                        <span class="raindDta">${response2.current.rain} mm</span>
                    </div>`;


                    for (let j = 1; j < 6; j++) {
                        let nextDaysContainer = document.createElement('div');
                        nextDaysContainer.classList.add('nextDaysContainer');

                        nextDaysContainer.innerHTML = ` <div class="nextDaysTemp">${(response2.daily.temperature_2m_max)[j]}<sup             class="superscript">&deg;C</sup></div>
                        <div class="nextDaysIcon"><img
                        src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather02-512.png "
                        alt="" id=""></div>
                        <div class="nextDayName">Thu</div>`;

                        nextDayDetails.append(nextDaysContainer)
                        // console.log((response2.daily.temperature_2m_max)[j])

                    }


                })
            })



        }

    })
})



