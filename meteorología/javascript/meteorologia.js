document.addEventListener('DOMContentLoaded', () => {
  renderFavorites();
  const getCurrentLocationWeatherButton = document.getElementById('getCurrentLocationWeather');
  if (getCurrentLocationWeatherButton) {
      getCurrentLocationWeatherButton.addEventListener('click', getCurrentLocationWeather);
  }
});

// obtener clima según el nombre introducido por el usuario
const getWeather = async () => {
  let city = document.getElementById('city').value.trim();
  if (!city) {
      console.error('Error: La ciudad no puede estar vacía.');
      return;
  }

  const apiKey = '4303341329ae4efca0782925241807';
  const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&aqi=no`;

  try {
      const response = await fetch(weatherUrl);
      if (!response.ok) {
          throw new Error('Error en la solicitud de clima: ' + response.statusText);
      }
      const weather = await response.json();
      currentWeather(weather);
      forecastWeather(weather);
      showStar(); // Mostrar ☆
      updateStarState(city); // Actualizar estado ☆
      setupStarEvent(weather); // Configurar evento ☆
  } catch (error) {
      console.error('Error:', error);
  }
}

// obtener el clima en la posición actual al pulsar el botón
const getCurrentLocationWeather = async () => {
  if (!navigator.geolocation) {
      console.error('Geolocalización no soportada por este navegador.');
      return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords; // destructuring
      const apiKey = '4303341329ae4efca0782925241807';
      const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;

      try {
          const response = await fetch(weatherUrl);
          if (!response.ok) {
              throw new Error('Error en la solicitud de clima: ' + response.statusText);
          }
          const weather = await response.json();
          currentWeather(weather);
          forecastWeather(weather);
          showStar(); // Mostrar ☆
          updateStarState(weather.location.name); // Actualizar estado ☆
          setupStarEvent(weather); // Configurar evento ☆
      } catch (error) {
          console.error('Error:', error);
      }
  }, (error) => {
      console.error('Error en la geolocalización:', error);
  });
}

// añadir info al DOM

const currentWeather = ({ current, location }) => {
  if (!current || !location) {
      console.error('Error: Datos de clima incompletos.');
      return;
  }
  const currentWeatherDiv = document.getElementById('currentWeather');
  const { name, country } = location;
  const { condition: { text, icon }, temp_c, humidity, wind_kph, precip_in } = current;
  const currentTemplate = ` 
    <div class="mainInfo">
      <div class="cityandp">
        <h2>${name} / ${country}</h2>
        <p>${text}</p>
      </div>
      <img class="weather-icon" src="http:${icon}" alt="${text}">
      <div class="celsius">${temp_c}<img src="../assets/icons/termometro.png" id="celsius" alt="grados"></div>
    </div>    
    <ul>
      <li>Precipitaciones: ${precip_in}%</li>
      <li>Humedad: ${humidity}%</li>
      <li>Viento: ${wind_kph} Km/h</li>
    </ul>
  `;
  currentWeatherDiv.innerHTML = currentTemplate;
}

const forecastWeather = ({ forecast }) => {
  const forecastWeather = document.getElementById('forecastWeather');
  forecastWeather.innerHTML = ''; // imp 
  const forecastDay = forecast.forecastday[0].hour;
  forecastDay.forEach(day => {
      const { condition: { text, icon }, time, temp_c } = day;
      //console.log(time);
      const timeFormat = time.split(" ")[1]; 
      //console.log(timeFormat);
      const forecastTemplate = `
        <li class="forecast-grades">
          <span>${timeFormat}</span>
          <img class="weather-icon" src="http:${icon}" alt="${text}">
          <p>${temp_c} °C</p>
        </li>
      `;
      forecastWeather.innerHTML += forecastTemplate;
  });
}

// funciones estrella

const showStar = () => {
  const starIcon = document.getElementById('star');
  starIcon.style.display = 'flex'; 
}

const updateStarState = (city) => {
  const starIcon = document.getElementById('star');
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let index = favorites.findIndex(fav => fav.city === city);
  if (index !== -1) {
      starIcon.textContent = '★'; 
      starIcon.title = 'Quitar de favoritos';
  } else {
      starIcon.textContent = '☆'; 
      starIcon.title = 'Agregar a favoritos';
  }
}

const renderFavorites = () => {
  const favoritesList = document.querySelector('.favoritesList');
  favoritesList.innerHTML = ''; 

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  favorites.forEach(({ city, icon, temp_c }) => {
      const li = document.createElement('li');
      li.innerHTML = `
          <span>${city}</span>
          <img class="weather-icon" src="${icon}" alt="Weather icon">
          <p>${temp_c} °C</p>
          <span class="favorite-star" title="Quitar de favoritos">★</span>
      `;
      favoritesList.appendChild(li);

      const favoriteStar = li.querySelector('.favorite-star');
      favoriteStar.addEventListener('click', () => {
          removeFavorite(city);
      });
  });
}

const removeFavorite = (city) => {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(fav => fav.city !== city);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderFavorites();
}

const setupStarEvent = (weather) => {
  const starIcon = document.getElementById('star');
  const { location, current } = weather;
  const { name: city } = location;
  const { condition: { icon }, temp_c } = current;

  starIcon.addEventListener('click', function() {
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      let weatherData = { city, icon: `http:${icon}`, temp_c };

      let index = favorites.findIndex(fav => fav.city === city);
      if (index === -1) {
          favorites.push(weatherData);
          localStorage.setItem('favorites', JSON.stringify(favorites));
          starIcon.textContent = '★'; 
          starIcon.title = 'Quitar de favoritos';
      } else {
          favorites.splice(index, 1);
          localStorage.setItem('favorites', JSON.stringify(favorites));
          starIcon.textContent = '☆'; 
          starIcon.title = 'Agregar a favoritos';
      }

      renderFavorites(); 
  });
}
