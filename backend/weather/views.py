import requests
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse


def fetch_weather(city):
    """Fetch current weather + 3-day forecast from WeatherAPI."""
    try:
        url = f"{settings.WEATHER_API_BASE}/forecast.json"
        params = {
            'key': settings.WEATHER_API_KEY,
            'q': city,
            'days': 5,
            'aqi': 'yes',
            'alerts': 'yes',
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json(), None
    except requests.exceptions.ConnectionError:
        return None, "Connection error. Please check your internet."
    except requests.exceptions.Timeout:
        return None, "Request timed out. Try again."
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 400:
            return None, f"City '{city}' not found. Please try another city."
        return None, "API error. Please try again later."
    except Exception as e:
        return None, str(e)


def index(request):
    """Home page - default city: Kolkata."""
    city = request.GET.get('city', 'Kolkata').strip()
    data, error = fetch_weather(city)

    context = {
        'city': city,
        'error': error,
        'weather': data,
        'quick_cities': ['Kolkata', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'],
    }

    if data:
        current  = data['current']
        location = data['location']
        forecast = data['forecast']['forecastday']
        aqi      = current.get('air_quality', {})

        wind_deg = current.get('wind_degree', 0)
        dirs = ['N','NE','E','SE','S','SW','W','NW']
        wind_dir_label = dirs[round(wind_deg / 45) % 8]

        aqi_us = aqi.get('us-epa-index', 1)
        aqi_labels = {1:'Good',2:'Moderate',3:'Unhealthy for Sensitive',4:'Unhealthy',5:'Very Unhealthy',6:'Hazardous'}
        aqi_colors = {1:'#00e400',2:'#ffff00',3:'#ff7e00',4:'#ff0000',5:'#8f3f97',6:'#7e0023'}

        context.update({
            'location': location,
            'current': current,
            'forecast': forecast,
            'wind_dir_label': wind_dir_label,
            'aqi_level': aqi_labels.get(aqi_us, 'Unknown'),
            'aqi_color': aqi_colors.get(aqi_us, '#00e400'),
            'aqi_value': round(aqi.get('pm2_5', 0), 1),
            'alerts': data.get('alerts', {}).get('alert', []),
        })

    return render(request, 'index.html', context)


def api_weather(request, city):
    """JSON API endpoint for weather data with full processed context."""
    data, error = fetch_weather(city)
    if error:
        return JsonResponse({'error': error}, status=400)
    
    current  = data['current']
    location = data['location']
    forecast = data['forecast']['forecastday']
    aqi      = current.get('air_quality', {})

    wind_deg = current.get('wind_degree', 0)
    dirs = ['N','NE','E','SE','S','SW','W','NW']
    wind_dir_label = dirs[round(wind_deg / 45) % 8]

    aqi_us = aqi.get('us-epa-index', 1)
    aqi_labels = {1:'Good',2:'Moderate',3:'Unhealthy for Sensitive',4:'Unhealthy',5:'Very Unhealthy',6:'Hazardous'}
    aqi_colors = {1:'#00e400',2:'#ffff00',3:'#ff7e00',4:'#ff0000',5:'#8f3f97',6:'#7e0023'}

    response_data = {
        'location': location,
        'current': current,
        'forecast': forecast,
        'wind_dir_label': wind_dir_label,
        'aqi_level': aqi_labels.get(aqi_us, 'Unknown'),
        'aqi_color': aqi_colors.get(aqi_us, '#00e400'),
        'aqi_value': round(aqi.get('pm2_5', 0), 1),
        'alerts': data.get('alerts', {}).get('alert', []),
        'quick_cities': ['Kolkata', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'],
    }
    
    return JsonResponse(response_data)


def search_suggestions(request):
    """Get city suggestions for autocomplete."""
    query = request.GET.get('q', '').strip()
    if not query or len(query) < 2:
        return JsonResponse({'suggestions': []})
    
    try:
        url = f"{settings.WEATHER_API_BASE}/current.json"
        params = {'key': settings.WEATHER_API_KEY, 'q': query}
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            location = data['location']
            suggestion = f"{location['name']}, {location['region']}, {location['country']}"
            return JsonResponse({'suggestions': [suggestion]})
        else:
            return JsonResponse({'suggestions': []})
    except Exception:
        return JsonResponse({'suggestions': []})
