'use client';

import { useState } from 'react';
import axios from 'axios';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

interface FavoriteCitiesProps {
  favorites: string[];
  onFavoritesChange: (favorites: string[]) => void;
}

export default function FavoriteCities({ favorites, onFavoritesChange }: FavoriteCitiesProps) {
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const API_KEY = '729d536913428102ed055faf12ed693b';

  const fetchWeatherData = async (city: string) => {
    if (weatherData[city]) return; // Si ya tenemos los datos, no los volvemos a cargar

    setLoading(city);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );
      setWeatherData(prev => ({
        ...prev,
        [city]: response.data
      }));
    } catch (error) {
      console.error('Error al obtener el clima:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleCityClick = (city: string) => {
    if (expandedCity === city) {
      setExpandedCity(null);
    } else {
      setExpandedCity(city);
      fetchWeatherData(city);
    }
  };

  const removeFavorite = (cityToRemove: string) => {
    const updatedFavorites = favorites.filter(city => city !== cityToRemove);
    onFavoritesChange(updatedFavorites);
    localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
    if (expandedCity === cityToRemove) {
      setExpandedCity(null);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
      <h3 className="text-xl font-bold mb-4">Ciudades Favoritas</h3>
      
      {favorites.length > 0 ? (
        <div className="space-y-2">
          {favorites.map((city) => (
            <div
              key={city}
              className="bg-gray-50 rounded-lg overflow-hidden transition-all duration-300"
            >
              <div className="flex items-center justify-between p-2 hover:bg-gray-100 transition-colors">
                <button
                  onClick={() => handleCityClick(city)}
                  className="flex-1 text-left hover:text-blue-500 cursor-pointer"
                >
                  {city}
                </button>
                <button
                  onClick={() => removeFavorite(city)}
                  className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                  title="Eliminar de favoritos"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              
              {expandedCity === city && (
                <div className="p-4 bg-white border-t">
                  {loading === city ? (
                    <div className="text-center py-2">Cargando...</div>
                  ) : weatherData[city] ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Temperatura:</span>
                        <span className="font-semibold">{Math.round(weatherData[city].main.temp)}°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Sensación térmica:</span>
                        <span className="font-semibold">{Math.round(weatherData[city].main.feels_like)}°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Humedad:</span>
                        <span className="font-semibold">{weatherData[city].main.humidity}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Viento:</span>
                        <span className="font-semibold">{weatherData[city].wind.speed} m/s</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Condición:</span>
                        <span className="font-semibold capitalize">{weatherData[city].weather[0].description}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 text-red-500">Error al cargar el clima</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-2">
          No hay ciudades favoritas. ¡Agrega algunas usando el corazón!
        </p>
      )}
    </div>
  );
} 