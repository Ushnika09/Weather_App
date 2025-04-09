

document.addEventListener("DOMContentLoaded",()=>{

    console.log("Dom Loaded....");
    
    const apiKey="6355bd5aa05ce5fe54fc409f52012414"
    const searchBar=document.getElementById("search")
    const currLocation=document.getElementById("btn")
    const submitBtn=document.getElementById("submit")
    const contentBox=document.getElementById("content")
    const forecast=document.getElementById("forecast")


    forecast.style.display="none"

    submitBtn.addEventListener("click",()=>{

        const location=searchBar.value.trim();

        if (location && isNaN(location) && !location.includes("http")){
            getWeatherData(location)
        }else{
            alert("Please enter a location....")
        }
    })

    function getWeatherData(location){
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
        fetch(url)
        .then(reponse=>reponse.json())
        .then(data=>{
            console.log(data)
            displayWeather(data)
        })
        .catch((e)=>{
            console.log(e)
            alert("Couldn't fetch information of the given location😢")
        })
    }

    function displayWeather(data) {
        const { name, main, weather, wind, sys, clouds } = data;
        
        // Get time in 12-hour format
        const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Determine weather icon based on condition
        const weatherIcon = getWeatherIcon(weather[0].main, weather[0].description);
        
        contentBox.innerHTML = `
            <div class="w-full h-full flex flex-col items-center justify-center p-4">
                <div class="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 w-full max-w-md">
                    <!-- Location and main weather -->
                    <div class="flex flex-col items-center mb-6">
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">${name}</h1>
                        <div class="flex items-center justify-center gap-2">
                            ${weatherIcon}
                            <span class="text-2xl font-semibold text-gray-700">${weather[0].main}</span>
                        </div>
                    </div>
                    
                    <!-- Temperature display -->
                    <div class="flex justify-center items-center gap-4 mb-6">
                        <div class="text-5xl font-bold text-blue-600">${Math.round(main.temp)}°C</div>
                        <div class="flex flex-col">
                            <span class="text-gray-600">Feels like: ${Math.round(main.feels_like)}°C</span>
                            <span class="text-gray-600">Humidity: ${main.humidity}%</span>
                        </div>
                    </div>
                    
                    <!-- Weather details grid -->
                    <div class="grid grid-cols-2 gap-4 text-gray-700">
                        <div class="bg-blue-50/50 p-3 rounded-lg flex items-center gap-2">
                            <i class="fas fa-wind text-blue-500"></i>
                            <span>${wind.speed} m/s</span>
                        </div>
                        <div class="bg-blue-50/50 p-3 rounded-lg flex items-center gap-2">
                            <i class="fas fa-cloud text-blue-400"></i>
                            <span>${clouds?.all || 0}% clouds</span>
                        </div>
                        <div class="bg-amber-50/50 p-3 rounded-lg flex items-center gap-2">
                            <i class="fas fa-sun text-amber-400"></i>
                            <span>${sunrise}</span>
                        </div>
                        <div class="bg-purple-50/50 p-3 rounded-lg flex items-center gap-2">
                            <i class="fas fa-moon text-purple-400"></i>
                            <span>${sunset}</span>
                        </div>
                    </div>
                    
                    <!-- Weather description -->
                    <div class="mt-4 text-center text-gray-600 italic">
                        "${weather[0].description}"
                    </div>
                </div>
            </div>
        `;
        
        // Show forecast section after displaying weather
        forecast.style.display = "block";
    }
    
    // Helper function to get appropriate weather icon
    function getWeatherIcon(main, description) {
        const isDay = new Date().getHours() > 6 && new Date().getHours() < 18;
        
        const icons = {
            'Clear': isDay ? '<i class="fas fa-sun text-yellow-400 text-4xl"></i>' : '<i class="fas fa-moon text-blue-300 text-4xl"></i>',
            'Clouds': description.includes('few') 
                ? '<i class="fas fa-cloud-sun text-gray-400 text-4xl"></i>' 
                : '<i class="fas fa-cloud text-gray-400 text-4xl"></i>',
            'Rain': '<i class="fas fa-cloud-rain text-blue-400 text-4xl"></i>',
            'Drizzle': '<i class="fas fa-cloud-rain text-blue-300 text-4xl"></i>',
            'Thunderstorm': '<i class="fas fa-bolt text-yellow-500 text-4xl"></i>',
            'Snow': '<i class="fas fa-snowflake text-blue-100 text-4xl"></i>',
            'Mist': '<i class="fas fa-smog text-gray-300 text-4xl"></i>',
            'Smoke': '<i class="fas fa-smog text-gray-400 text-4xl"></i>',
            'Haze': '<i class="fas fa-smog text-gray-300 text-4xl"></i>',
            'Fog': '<i class="fas fa-smog text-gray-300 text-4xl"></i>',
            'Dust': '<i class="fas fa-wind text-amber-300 text-4xl"></i>',
            'Sand': '<i class="fas fa-wind text-amber-400 text-4xl"></i>',
            'Ash': '<i class="fas fa-mountain text-gray-500 text-4xl"></i>',
            'Squall': '<i class="fas fa-wind text-gray-500 text-4xl"></i>',
            'Tornado': '<i class="fas fa-wind text-red-500 text-4xl"></i>'
        };
        
        return icons[main] || '<i class="fas fa-question-circle text-gray-400 text-4xl"></i>';
    }
})



