const unitToggle = document.getElementById('unitToggle');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const geoBtn = document.getElementById('geoBtn');
const suggestionsDropdown = document.getElementById('suggestionsDropdown');

let isCelsius = true;
let currentWeatherData = null;

// Determine backend URL
const BACKEND_URL = "https://aqweather-sankha.onrender.com";

// --- UI State Management ---

function showState(stateId) {
  ['loadingState', 'errorCard', 'weatherData', 'welcomeState'].forEach(id => {
    document.getElementById(id).classList.toggle('hidden', id !== stateId);
  });
}

function showError(message) {
  document.getElementById('errorMessage').textContent = message;
  showState('errorCard');
}

// --- API Calls ---

async function fetchWeather(city) {
  showState('loadingState');
  try {
    const res = await fetch(`${BACKEND_URL}/api/weather/${encodeURIComponent(city)}/`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch weather');

    currentWeatherData = data;
    renderWeather(data);
    showState('weatherData');

    // Update URL without reloading
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('city', city);
    window.history.pushState({}, '', newUrl);
  } catch (err) {
    showError(err.message);
  }
}

// --- Rendering ---

function renderWeather(data) {
  const { location, current, forecast, wind_dir_label, aqi_level, aqi_color, aqi_value, alerts, quick_cities } = data;

  // Title and Header
  document.getElementById('pageTitle').textContent = `AqWeather — ${location.name}`;
  document.getElementById('appBody').className = current.is_day ? 'day' : 'night';
  searchInput.value = location.name;

  // Hero Section
  document.getElementById('cityName').textContent = location.name;
  document.getElementById('locationDetail').textContent = `${location.region}${location.region ? ', ' : ''}${location.country}`;
  document.getElementById('localTimeDisplay').textContent = `🕒 ${location.localtime}`;

  const condIcon = document.getElementById('conditionIcon');
  condIcon.src = `https:${current.condition.icon}`;
  condIcon.alt = current.condition.text;

  document.getElementById('tempC').textContent = `${current.temp_c}°C`;
  document.getElementById('tempF').textContent = `${current.temp_f}°F`;
  document.getElementById('feelsLikeC').textContent = `${current.feelslike_c}°C`;
  document.getElementById('feelsLikeF').textContent = `${current.feelslike_f}°F`;
  document.getElementById('conditionText').textContent = current.condition.text;

  // Stats
  document.getElementById('humidityVal').textContent = `${current.humidity}%`;
  document.getElementById('windVal').textContent = `${current.wind_kph} km/h ${wind_dir_label}`;
  document.getElementById('visibilityVal').textContent = `${current.vis_km} km`;
  document.getElementById('pressureVal').textContent = `${current.pressure_mb} mb`;
  document.getElementById('cloudVal').textContent = `${current.cloud}%`;

  const aqiEl = document.getElementById('aqiVal');
  aqiEl.textContent = `${aqi_level} (${aqi_value})`;
  aqiEl.style.color = aqi_color;

  // Alerts
  const alertsSection = document.getElementById('alertsSection');
  if (alerts && alerts.length > 0) {
    alertsSection.classList.remove('hidden');
    alertsSection.innerHTML = alerts.map(alert => `
      <div class="alert-card">
        <span class="alert-icon">🚨</span>
        <div>
          <strong>${alert.headline}</strong>
          <p>${alert.desc.split(' ').slice(0, 30).join(' ')}...</p>
        </div>
      </div>
    `).join('');
  } else {
    alertsSection.classList.add('hidden');
  }

  // Hourly Forecast
  const hourlyContainer = document.getElementById('hourlyForecast');
  hourlyContainer.innerHTML = forecast[0].hour.map(hour => `
    <div class="hourly-card">
      <p class="hour-time">${hour.time.slice(11)}</p>
      <img src="https:${hour.condition.icon}" alt="${hour.condition.text}" class="hour-icon"/>
      <p class="hour-temp celsius ${isCelsius ? '' : 'hidden'}">${hour.temp_c}°C</p>
      <p class="hour-temp fahrenheit ${isCelsius ? 'hidden' : ''}">${hour.temp_f}°F</p>
      <p class="hour-rain">🌧 ${hour.chance_of_rain}%</p>
    </div>
  `).join('');

  // 5-Day Forecast
  const dailyContainer = document.getElementById('dailyForecast');
  dailyContainer.innerHTML = forecast.map(day => `
    <div class="forecast-card">
      <p class="forecast-day">${day.date}</p>
      <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" class="forecast-icon"/>
      <p class="forecast-condition">${day.day.condition.text}</p>
      <div class="forecast-temps">
        <span class="temp-high celsius ${isCelsius ? '' : 'hidden'}">${day.day.maxtemp_c}°</span>
        <span class="temp-high fahrenheit ${isCelsius ? 'hidden' : ''}">${day.day.maxtemp_f}°</span>
        <span class="temp-sep">/</span>
        <span class="temp-low celsius ${isCelsius ? '' : 'hidden'}">${day.day.mintemp_c}°</span>
        <span class="temp-low fahrenheit ${isCelsius ? 'hidden' : ''}">${day.day.mintemp_f}°</span>
      </div>
      <div class="forecast-extras">
        <span>🌧 ${day.day.daily_chance_of_rain}%</span>
        <span>💧 ${day.day.avghumidity}%</span>
      </div>
    </div>
  `).join('');

  // Sun & Moon
  const sunMoonContainer = document.getElementById('sunMoonData');
  const astro = forecast[0].astro;
  sunMoonContainer.innerHTML = `
    <div class="sun-card">
      <div class="sun-item">
        <span class="sun-label">🌅 Sunrise</span>
        <span class="sun-val">${astro.sunrise}</span>
      </div>
      <div class="sun-item">
        <span class="sun-label">🌇 Sunset</span>
        <span class="sun-val">${astro.sunset}</span>
      </div>
      <div class="sun-item">
        <span class="sun-label">🌕 Moonrise</span>
        <span class="sun-val">${astro.moonrise}</span>
      </div>
      <div class="sun-item">
        <span class="sun-label">🌑 Moonset</span>
        <span class="sun-val">${astro.moonset}</span>
      </div>
      <div class="sun-item">
        <span class="sun-label">🌙 Moon Phase</span>
        <span class="sun-val">${astro.moon_phase}</span>
      </div>
    </div>
  `;

  // Quick Cities (Welcome State)
  const quickCitiesContainer = document.getElementById('quickCities');
  quickCitiesContainer.innerHTML = '<span class="quick-label">Quick search:</span>' +
    quick_cities.map(city => `<a href="#" class="quick-city" onclick="fetchWeather('${city}'); return false;">${city}</a>`).join('');

  highlightCurrentHour();
  applyFadeIn();
}

// --- Helper Functions ---

function highlightCurrentHour() {
  const now = new Date();
  const currentHour = now.getHours();
  document.querySelectorAll('.hourly-card').forEach((card, index) => {
    if (index === currentHour) {
      card.classList.add('active');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
}

function applyFadeIn() {
  const cards = document.querySelectorAll('.forecast-card, .stat-item, .hourly-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.4s ease ${i * 0.04}s, transform 0.4s ease ${i * 0.04}s`;
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 50);
  });
}

// --- Event Listeners ---

unitToggle?.addEventListener('click', () => {
  isCelsius = !isCelsius;
  document.querySelectorAll('.celsius').forEach(el => el.classList.toggle('hidden', !isCelsius));
  document.querySelectorAll('.fahrenheit').forEach(el => el.classList.toggle('hidden', isCelsius));
  unitToggle.textContent = isCelsius ? '°C / °F' : '°F / °C';
});

geoBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  if (navigator.geolocation) {
    geoBtn.textContent = '⏳';
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        fetchWeather(`${latitude},${longitude}`);
        geoBtn.textContent = '📍';
      },
      () => {
        geoBtn.textContent = '📍';
        alert('Location access denied. Please search manually.');
      }
    );
  } else {
    alert('Geolocation not supported by your browser.');
  }
});

searchForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) fetchWeather(query);
});

// Suggestions logic
let suggestionsTimeout;
searchInput?.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  clearTimeout(suggestionsTimeout);
  if (query.length < 2) {
    suggestionsDropdown.innerHTML = '';
    return;
  }
  suggestionsTimeout = setTimeout(() => {
    fetch(`${BACKEND_URL}/api/suggestions/?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        suggestionsDropdown.innerHTML = '';
        if (data.suggestions && data.suggestions.length > 0) {
          data.suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = suggestion;
            div.addEventListener('click', () => {
              const cityName = suggestion.split(',')[0].trim();
              searchInput.value = cityName;
              suggestionsDropdown.innerHTML = '';
              fetchWeather(cityName);
            });
            suggestionsDropdown.appendChild(div);
          });
        }
      });
  }, 300);
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-box')) {
    suggestionsDropdown.innerHTML = '';
  }
});

// --- Initialization ---

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const city = urlParams.get('city');
  if (city) {
    fetchWeather(city);
  } else {
    fetchWeather('Kolkata');
  }
});

setInterval(() => {
  const clockEl = document.getElementById('localTimeDisplay');
  if (clockEl && currentWeatherData) {
    const now = new Date();
    clockEl.textContent = '🕒 ' + now.toLocaleString();
  }
}, 1000);

console.log('%c⛅ AqWeather by Sankha Adak', 'color:#ffffff; font-size:16px; font-weight:bold;');
