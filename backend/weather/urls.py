from django.urls import path
from . import views

urlpatterns = [
    path('',                      views.index,                name='index'),
    path('api/weather/<city>/',   views.api_weather,         name='api_weather'),
    path('api/suggestions/',      views.search_suggestions,  name='search_suggestions'),
]
