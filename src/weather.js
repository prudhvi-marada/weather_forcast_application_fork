//open weather api key
const apiKey = 'f6d2ce7f83a903ae9cf61aa528174df9'

const main = document.querySelector("main");
const currentTemp = document.querySelector('#currentTemp');
const currentDesc = document.querySelector('#currentDesc');
const currentHumidity = document.querySelector('#currentHumidity');
const currentWind = document.querySelector('#currentWind');
const currentImage = document.querySelector("#currentImage");

const city = document.querySelector("#city");


const dropdownCtn = document.querySelector("#dropdownCtn");
const inputCity = document.querySelector("#inputSearch")
inputCity.addEventListener("input",()=>{
    const searchcity = (localStorage.getItem("recentlySearch"))?JSON.parse(localStorage.getItem("recentlySearch")):[]
  
    const filterbyInput = searchcity.filter((item)=>{
       
        
        return item.slice(0,inputCity.value.length).toUpperCase() == inputCity.value.toUpperCase();
    })
    console.log(filterbyInput)
    dropdownCtn.innerHTML = ""
    if(!inputCity.value.trim()){
        dropdownCtn.innerHTML = "";
        return ;
    }
    filterbyInput.map((city)=>{
       let p = document.createElement("p");
       p.classList.add("text-black","border","p-2","hover:text-black","cursor-pointer")
       p.innerText = city;
       p.addEventListener("click",()=>{
        inputCity.value = p.innerText;
        dropdownCtn.innerHTML = ""
       });
       dropdownCtn.append(p);
    })

})


//select five weather ctn
const fiveDaysList = document.querySelector('#fiveDaysList')



//reusable functions
const reusableMethod = {
    //display current day weather
    displayCurrentWeather:(weather)=>{
        currentTemp.innerHTML = weather.temp
        currentDesc.innerHTML = weather.desc
        currentImage.src = weather.icon
        currentHumidity.innerHTML = weather.humidity
        currentWind.innerHTML = weather.wind
    },

    // display next five's days weather
    displayNextFiveWeather:(weatherList)=>{
        const listDate = [];
        const days = weatherList.filter((item,index)=>{
            if(!listDate.includes(item.dt_txt.split(" ")[0])){
                listDate.push(item.dt_txt.split(" ")[0])
                return item;
            }
        });
      
        fiveDaysList.innerHTML = '';
    
        days.map((weather,index) => {
            if(index != 0){
    
                const article = document.createElement("article");
                article.classList.add("m-1", "flex", "flex-col", "p-2", "h-full", "text-2xl", "shadow-xl", "text-white", "rounded-2xl", "bg-gradient-to-b", "from-blue-600", "to-blue-200")
                article.innerHTML = `<h2 class="text-2xl">${weather.dt_txt.split(" ")[0]}</h2>
                                    <center>
                                        <img class="w-[200px]" src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="weatherIcon">
                                   </center>
                                   <p><strong>Temperature:</strong>${weather.main.temp}°C</p>
                                   <p><strong>Wind:</strong>${weather.wind.speed}Km/H</p>
                                   <p><strong>Humidity:</strong>${weather.main.humidity}%</p>`
                fiveDaysList.appendChild(article);
            }
        })
    
    },

    // validation of search city
    cityValidation(city){
        if(!city){
            return "city name is required"
        }
        if(city.length<2 || city.length>50){
            return "city name should contain at least 2 charactor and maximum 50 charactor"
        }
        const isLetter = /^[a-zA-Z\s\-]+$/;
      
        if(!isLetter.test(city)){
            return "city name should'nt include numbers or special charactor"

        }

        return "valid"
    }
}









//this function choose way of search which user want in search city or use current location
const displaySearch = () => {

    const selectMethod = document.querySelector("#selectMethod").value;
    if (selectMethod == "Search City") {
        document.querySelector("#searchCtn").style.display = "flex"
        
       
    } else {
        main.style.display = "none"
        setTimeout(()=>{
            main.style.display = "grid";
        },1000)
        renderCurrentLocationData();
        document.querySelector("#searchCtn").style.display = "none"

    }
}







// this function render weather's data  of user's current location
async function renderCurrentLocationData() {
    
    try {

        //display current weather
        navigator.geolocation.getCurrentPosition(
            async function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

               
               

               


                //fetch next five's days weather
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
                const data = await response.json()
                console.log(data.city.name)
                city.innerHTML = data.city.name;
                 //user's location current weather
                 const weather = {
                    temp: `${data.list[0].main.temp}°C`,
                    desc: `${data.list[0].weather[0].description}`,
                    icon: `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`,
                    humidity: `<i class="text-4xl fa-solid fa-droplet"></i>${data.list[0].main.humidity}% <br>
                    Humidity`,
                    wind: `<i class="text-4xl fa-solid fa-wind"></i>${data.list[0].wind.speed}Km/H<br>
                   Wind`

                }
               reusableMethod.displayCurrentWeather(weather)
               reusableMethod.displayNextFiveWeather(data.list);



            },
            function (error) {
                console.error(error);
            }
        );


       



    } catch (error) {
        console.log(`error: ${error}`)
    }

}

//render current location's data when user visit first time on site
renderCurrentLocationData();








async function searchWeather(){
    const cityName = document.querySelector("#inputSearch").value.trim();
    const validMessage = reusableMethod.cityValidation(cityName)
    if(validMessage != 'valid'){
        return alert(validMessage);
    }
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`);
        const data = await response.json();
        city.innerHTML = data.city.name;
        const weather = {
            temp: `${data.list[0].main.temp}°C`,
            desc: `${data.list[0].weather[0].description}`,
            icon: `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`,
            humidity: `<i class="text-4xl fa-solid fa-droplet"></i>${data.list[0].main.humidity}% <br>
            Humidity`,
            wind: `<i class="text-4xl fa-solid fa-wind"></i>${data.list[0].wind.speed}Km/H<br>
           Wind`

        }
       reusableMethod.displayCurrentWeather(weather)
       reusableMethod.displayNextFiveWeather(data.list);
       const recentlySearch = (localStorage.getItem("recentlySearch"))?JSON.parse(localStorage.getItem('recentlySearch')):[];
       const capitalize = recentlySearch.map((item)=>item.toUpperCase());
       if(!capitalize.includes(cityName.toUpperCase())){

           recentlySearch.push(cityName);
       }
       localStorage.setItem("recentlySearch",JSON.stringify(recentlySearch));
        main.style.display = "none"
        setTimeout(()=>{
            main.style.display = "grid";
        },1000)
        
    } catch (error) {
        console.log("error",error)
    }
}












