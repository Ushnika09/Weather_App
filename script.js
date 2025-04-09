
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Loaded....");
    
    const apiKey = "6355bd5aa05ce5fe54fc409f52012414";
    const searchBar = document.getElementById("search");
    const currLocation = document.getElementById("btn");
    const submitBtn = document.getElementById("submit");
    const contentBox = document.getElementById("content");
    const forecast = document.getElementById("forecast");
    const forecastDays = document.getElementById("forecastDays");
    const recentSearches = document.getElementById("recentSearches");
    const buttonContainer = document.getElementById("buttonContainer");

    forecast.style.display = "none";

    submitBtn.addEventListener("click", handleSearch);
    searchBar.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSearch();
    });

    searchBar.addEventListener("focus", () => {
        renderRecentSearches();
        recentSearches.classList.remove("hidden");
        buttonContainer.classList.add("buttons-slide-down");
    });

    document.addEventListener("click", (e) => {
        if (!searchBar.contains(e.target) && !recentSearches.contains(e.target)) {
            recentSearches.classList.add("hidden");
            buttonContainer.classList.remove("buttons-slide-down");
        }
    });

    function handleSearch() {
        const location = searchBar.value.trim();
        if (location && isNaN(location) && !location.includes("http")) {
            getWeatherData(location);
            recentSearches.classList.add("hidden");
            buttonContainer.classList.remove("buttons-slide-down");
        } else {
            showAlert("Please enter a valid location");
        }
    }

    function showAlert(message) {
        const alertDiv = document.createElement("div");
        alertDiv.className = "fixed top-2 se:top-4 right-2 se:right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 se:px-4 py-2 rounded-lg shadow-lg animate-fade-in";
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        setTimeout(() => {
            alertDiv.classList.add("animate-fade-out");
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }

    function getWeatherData(location) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
        
        contentBox.innerHTML = `
            <div class="w-full h-full flex items-center justify-center">
                <div class="animate-spin rounded-full h-10 se:h-12 w-10 se:w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        `;
        
        Promise.all([
            fetch(weatherUrl).then(res => res.json()),
            fetch(forecastUrl).then(res => res.json())
        ])
        .then(([weatherData, forecastData]) => {
            displayWeather(weatherData);
            displayForecast(forecastData);
            saveToRecentSearches(location);
        })
        .catch((e) => {
            console.error(e);
            showAlert("Couldn't fetch weather data for the given location");
            contentBox.innerHTML = `
                <div class="text-center text-gray-600">
                    <i class="fas fa-exclamation-triangle text-4xl se:text-5xl mb-3 se:mb-4 text-red-400"></i>
                    <p class="text-sm se:text-base">Couldn't fetch weather data</p>
                </div>
            `;
        });
    }
    
    function displayWeather(data) {
        if (data.cod !== 200) {
            showAlert(data.message || "Error fetching weather data");
            return;
        }
        
        const { name, main, weather, wind, sys, clouds, dt } = data;
        const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const lastUpdated = new Date(dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const weatherIcon = getWeatherIcon(weather[0].main, weather[0].description);
        
        contentBox.innerHTML = `
            <div class="w-full h-full flex flex-col items-center justify-center p-3 se:p-4">
                <div class="bg-white bg-opacity-90 rounded-xl shadow-lg p-4 se:p-6 w-full max-w-md transition-all duration-300 hover:shadow-xl">
                    <div class="flex flex-col items-center mb-4 se:mb-6">
                        <h1 class="text-2xl se:text-3xl font-bold text-indigo-800 mb-2">${name}</h1>
                        <div class="flex items-center justify-center gap-2">
                            ${weatherIcon}
                            <span class="text-xl se:text-2xl font-semibold text-teal-600">${weather[0].main}</span>
                        </div>
                        <p class="text-xs se:text-sm text-gray-500 mt-1">Last updated: ${lastUpdated}</p>
                    </div>
                    
                    <div class="flex justify-center items-center gap-3 se:gap-4 mb-4 se:mb-6">
                        <div class="text-4xl se:text-5xl font-bold text-purple-600">${Math.round(main.temp)}°C</div>
                        <div class="flex flex-col text-left">
                            <span class="text-sm se:text-base text-gray-700"><i class="fas fa-temperature-low mr-1 se:mr-2 text-blue-400"></i>Feels like: ${Math.round(main.feels_like)}°C</span>
                            <span class="text-sm se:text-base text-gray-700"><i class="fas fa-tint mr-1 se:mr-2 text-teal-400"></i>Humidity: ${main.humidity}%</span>
                            <span class="text-sm se:text-base text-gray-700"><i class="fas fa-gauge mr-1 se:mr-2 text-indigo-400"></i>Pressure: ${main.pressure} hPa</span>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 se:gap-4 text-gray-700">
                        <div class="bg-blue-100 p-2 se:p-3 rounded-lg flex items-center gap-2">
                            <i class="fas fa-wind text-blue-500"></i>
                            <span class="text-sm se:text-base">${wind.speed} m/s</span>
                        </div>
                        <div class="bg-teal-100 p-2 se:p-3 rounded-lg flex items-center gap-2">
                            <i class="fas fa-cloud text-teal-500"></i>
                            <span class="text-sm se:text-base">${clouds?.all || 0}% clouds</span>
                        </div>
                        <div class="bg-amber-100 p-2 se:p-3 rounded-lg flex items-center gap-2">
                            <i class="fas fa-sun text-amber-500"></i>
                            <span class="text-sm se:text-base">${sunrise}</span>
                        </div>
                        <div class="bg-purple-100 p-2 se:p-3 rounded-lg flex items-center gap-2">
                            <i class="fas fa-moon text-purple-500"></i>
                            <span class="text-sm se:text-base">${sunset}</span>
                        </div>
                    </div>
                    
                    <div class="mt-3 se:mt-4 text-center text-gray-600 italic bg-gradient-to-r from-purple-200 to-teal-200 p-2 rounded-lg text-sm se:text-base">
                        "${weather[0].description}"
                    </div>
                </div>
            </div>
        `;
        
        forecast.style.display = "block";
    }
    
    function displayForecast(data) {
        if (data.cod !== "200") {
            console.error("Forecast error:", data.message);
            return;
        }
        
        const dailyForecasts = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!dailyForecasts[date] || item.dt_txt.includes("12:00:00")) {
                dailyForecasts[date] = item;
            }
        });
        
        const forecastItems = Object.values(dailyForecasts).slice(0, 7);
        
        forecastDays.innerHTML = forecastItems.map(item => {
            const date = new Date(item.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const weatherIcon = getWeatherIcon(item.weather[0].main, item.weather[0].description, false);
            
            return `
                <div class="bg-gradient-to-br from-white to-blue-50 rounded-lg p-2 se:p-3 flex flex-col items-center justify-center transition-all duration-300 hover:bg-opacity-90 hover:shadow-md hover:scale-105 w-full max-w-[150px]">
                    <div class="font-semibold text-indigo-700 text-sm se:text-base">${dayName}</div>
                    <div class="text-xs se:text-sm text-gray-600 mb-1 se:mb-2">${dateStr}</div>
                    <div class="my-1 se:my-2">${weatherIcon}</div>
                    <div class="text-lg se:text-xl font-bold text-purple-600">${Math.round(item.main.temp)}°C</div>
                    <div class="text-xs se:text-sm text-teal-600">${item.weather[0].main}</div>
                </div>
            `;
        }).join("");
    }
    
    function getWeatherIcon(main, description, isLarge = true) {
        const isDay = new Date().getHours() > 6 && new Date().getHours() < 18;
        const sizeClass = isLarge ? "text-3xl se:text-4xl" : "text-xl se:text-2xl";
        
        const icons = {
            'Clear': isDay 
                ? `<i class="fas fa-sun text-yellow-500 ${sizeClass}"></i>` 
                : `<i class="fas fa-moon text-indigo-300 ${sizeClass}"></i>`,
            'Clouds': description.includes('few') || description.includes('scattered')
                ? `<i class="fas fa-cloud-sun text-teal-400 ${sizeClass}"></i>`
                : `<i class="fas fa-cloud text-gray-500 ${sizeClass}"></i>`,
            'Rain': `<i class="fas fa-cloud-rain text-blue-500 ${sizeClass}"></i>`,
            'Drizzle': `<i class="fas fa-cloud-rain text-blue-400 ${sizeClass}"></i>`,
            'Thunderstorm': `<i class="fas fa-bolt text-yellow-600 ${sizeClass}"></i>`,
            'Snow': `<i class="fas fa-snowflake text-blue-200 ${sizeClass}"></i>`,
            'Mist': `<i class="fas fa-smog text-gray-400 ${sizeClass}"></i>`,
            'Smoke': `<i class="fas fa-smog text-gray-500 ${sizeClass}"></i>`,
            'Haze': `<i class="fas fa-smog text-gray-400 ${sizeClass}"></i>`,
            'Fog': `<i class="fas fa-smog text-gray-400 ${sizeClass}"></i>`,
            'Dust': `<i class="fas fa-wind text-amber-400 ${sizeClass}"></i>`,
            'Sand': `<i class="fas fa-wind text-amber-500 ${sizeClass}"></i>`,
            'Ash': `<i class="fas fa-mountain text-gray-600 ${sizeClass}"></i>`,
            'Squall': `<i class="fas fa-wind text-gray-600 ${sizeClass}"></i>`,
            'Tornado': `<i class="fas fa-wind text-red-600 ${sizeClass}"></i>`
        };
        
        return icons[main] || `<i class="fas fa-question-circle text-gray-500 ${sizeClass}"></i>`;
    }

    
});
