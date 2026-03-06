# ⛅ AqWeather — Real-Time Weather Application

A beautiful, full-stack weather application built with **Python + Django + WeatherAPI**.
Get real-time weather, hourly forecasts, 5-day forecasts, air quality index, and more!

---

## 🌟 Features

- 🔍 **City Search** — Search any city worldwide
- 🌡️ **Real-Time Weather** — Temperature, humidity, wind, pressure, visibility
- ⏱️ **Hourly Forecast** — 24-hour breakdown with rain probability
- 📅 **5-Day Forecast** — Extended weather outlook
- 🌫️ **Air Quality Index (AQI)** — PM2.5 levels with color-coded labels
- 🌅 **Sun & Moon Info** — Sunrise, sunset, moonrise, moonset, moon phase
- 🚨 **Weather Alerts** — Real-time severe weather notifications
- 🌡️ **°C / °F Toggle** — Switch temperature units instantly
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🌙 **Day/Night Theme** — Background changes based on local time

---

## 🚀 Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Backend   | Python 3.10+, Django 4.2 |
| Frontend  | HTML5, CSS3, JavaScript |
| API       | WeatherAPI.com          |
| Server    | Gunicorn + WhiteNoise   |

---

## ⚙️ Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/FenixCode7/AqWeather.git
cd AqWeather
```

### 2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate       # Linux/Mac
venv\Scripts\activate          # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Get FREE API key
- Go to [weatherapi.com](https://www.weatherapi.com/)
- Sign up for free
- Copy your API key

### 5. Configure environment
```bash
cp .env.example .env
# Edit .env and add your API key
```

### 6. Run migrations & start server
```bash
python manage.py migrate
python manage.py runserver
```

### 7. Open in browser
```
http://localhost:8000
```

---

## 📁 Project Structure

```
AqWeather/
├── aqweather/
│   ├── settings.py       # Django configuration
│   ├── urls.py           # URL routing
│   └── wsgi.py           # WSGI entry point
├── weather/
│   ├── views.py          # Core weather logic + API calls
│   ├── urls.py           # App URL routes
│   └── models.py         # Search history model
├── templates/
│   └── weather/
│       └── index.html    # Main UI template
├── static/
│   ├── css/style.css     # Styles
│   └── js/main.js        # Frontend JavaScript
├── manage.py
├── requirements.txt
└── .env.example
```

---

## 🔌 API Endpoints

| Method | URL                     | Description           |
|--------|-------------------------|-----------------------|
| GET    | /                       | Home page (city=Kolkata default) |
| GET    | /?city=London           | Search specific city  |
| GET    | /api/weather/{city}/    | JSON weather data     |

---

## 🌐 Deployment (Vercel / Railway)

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn aqweather.wsgi:application
```

---

## 👨‍💻 Author

**Sankha Adak**
- GitHub: [github.com/FenixCode7](https://github.com/FenixCode7)
- LinkedIn: [linkedin.com/in/sankha-adak-b01916366](https://linkedin.com/in/sankha-adak-b01916366)
- Portfolio: [sankha.vercel.app](https://sankha.vercel.app)


