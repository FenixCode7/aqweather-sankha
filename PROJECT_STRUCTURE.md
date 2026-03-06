# AqWeather - Project Structure

```
aqweather/
├── frontend/                           # All frontend code (UI/Templates/Static files)
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css              # Main stylesheet (Dark theme)
│   │   ├── js/
│   │   │   └── main.js                # Frontend logic (search, geolocation, etc)
│   │   └── images/                    # Image assets (empty, ready for use)
│   └── templates/
│       └── weather/
│           └── index.html             # Main HTML template
│
├── backend/                            # All backend code (Django application)
│   ├── manage.py                      # Django command-line utility
│   ├── db.sqlite3                     # SQLite database
│   ├── aqweather/                     # Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py                # Django configuration (points to frontend/)
│   │   ├── urls.py                    # URL routing configuration
│   │   └── wsgi.py                    # WSGI application for deployment
│   └── weather/                       # Django app (main application logic)
│       ├── __init__.py
│       ├── models.py                  # Database models
│       ├── views.py                   # Request handlers & API endpoints
│       └── urls.py                    # App URL routing
│
├── .env                               # Environment variables (API keys, secrets)
├── .gitignore                         # Git ignore rules
├── db.sqlite3                         # Root database (legacy, use backend/db.sqlite3)
├── manage.py                          # Root manage.py (legacy, use backend/manage.py)
├── requirements.txt                   # Python dependencies
└── README.md                          # Project documentation
```

## Folder Organization

### 📁 Frontend Folder (`frontend/`)
Contains all user-facing code:
- **CSS**: Dark theme styling with black/white color scheme
- **JavaScript**: Search suggestions, geolocation, unit toggle, animations
- **Templates**: Django HTML templates with weather data display

### 📁 Backend Folder (`backend/`)
Contains Django application:
- **aqweather/**: Django project configuration
  - `settings.py` - Points TEMPLATES and STATIC dirs to `frontend/`
- **weather/**: Main Django app
  - `views.py` - Weather API integration, search suggestions
  - `models.py` - SearchHistory database model
  - `urls.py` - Route definitions

## To Run the Application

1. Navigate to backend folder:
   ```
   cd backend
   ```

2. Run Django development server:
   ```
   python manage.py runserver
   ```

3. Access at: `http://localhost:8000`

## API Endpoints

- `GET /` - Homepage with weather display
- `GET /api/weather/<city>/` - Get weather data (JSON)
- `GET /api/suggestions/?q=query` - Get city autocomplete suggestions

## Key Features

✅ Real-time weather data (Current, Hourly, 5-day forecast)
✅ Geolocation support (📍 button)
✅ Search city suggestions (autocomplete)
✅ Air Quality Index (AQI) display
✅ Dark black & white theme
✅ Temperature unit toggle (°C / °F)
✅ Responsive design
