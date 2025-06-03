'use client';

import { useState, useEffect } from 'react';
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

interface ErrorState {
  [key: string]: string;
}

interface FavoriteCitiesProps {
  favorites: string[];
  onFavoritesChange: (favorites: string[]) => void;
}

export default function FavoriteCities({ favorites, onFavoritesChange }: FavoriteCitiesProps) {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorState>({});

  const API_KEY = '729d536913428102ed055faf12ed693b';

  const fetchWeatherData = async (city: string) => {
    if (weatherData[city]) return;

    setLoading(city);
    setErrors(prev => ({ ...prev, [city]: '' })); // Limpiar error previo

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );
      setWeatherData(prev => ({
        ...prev,
        [city]: response.data
      }));
    } catch (error) {
      let errorMessage = 'Error al cargar el clima';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              errorMessage = 'Ciudad no encontrada';
              break;
            case 401:
              errorMessage = 'Error de autenticación con la API';
              break;
            case 429:
              errorMessage = 'Límite de peticiones excedido';
              break;
            case 500:
              errorMessage = 'Error del servidor';
              break;
            default:
              errorMessage = `Error ${error.response.status}: ${error.response.data.message || 'Error desconocido'}`;
          }
        } else if (error.request) {
          errorMessage = 'No se pudo conectar con el servidor';
        }
      }
      
      setErrors(prev => ({ ...prev, [city]: errorMessage }));
      console.error(`Error al obtener el clima para ${city}:`, error);
    } finally {
      setLoading(null);
    }
  };

  // Cargar datos del clima al montar el componente y cuando cambien los favoritos
  useEffect(() => {
    favorites.forEach(city => {
      fetchWeatherData(city);
    });
  }, [favorites]);

  const removeFavorite = (cityToRemove: string) => {
    const updatedFavorites = favorites.filter(city => city !== cityToRemove);
    onFavoritesChange(updatedFavorites);
    localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
    
    // Limpiar datos y errores de la ciudad eliminada
    setWeatherData(prev => {
      const newData = { ...prev };
      delete newData[cityToRemove];
      return newData;
    });
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[cityToRemove];
      return newErrors;
    });
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': 'sun',
      '01n': 'moon',
      '02d': 'cloud-sun',
      '02n': 'cloud-moon',
      '03d': 'cloud',
      '03n': 'cloud',
      '04d': 'cloud',
      '04n': 'cloud',
      '09d': 'cloud-showers-heavy',
      '09n': 'cloud-showers-heavy',
      '10d': 'cloud-sun-rain',
      '10n': 'cloud-moon-rain',
      '11d': 'bolt',
      '11n': 'bolt',
      '13d': 'snowflake',
      '13n': 'snowflake',
      '50d': 'smog',
      '50n': 'smog'
    };

    return iconMap[iconCode] || 'sun';
  };

  const getTemperatureColor = (temp: number) => {
    if (temp <= 10) return 'text-blue-500'; // Frío
    if (temp <= 25) return 'text-yellow-500'; // Templado
    return 'text-red-500'; // Caliente
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
      <h3 className="text-xl font-bold mb-4">Ciudades Favoritas</h3>
      
      {favorites.length > 0 ? (
        <div className="space-y-2">
          {favorites.map((city) => (
            <div
              key={city}
              className="bg-gray-50 rounded-lg overflow-hidden group"
            >
              <div 
                className={`flex items-center justify-between p-2 transition-all duration-300 ${expandedCity === city ? 'bg-gray-200' : 'hover:bg-gray-100 hover:scale-[1.02]'}`}
                onClick={() => setExpandedCity(expandedCity === city ? null : city)}
              >
                <div className="flex items-center gap-2 flex-1 text-left hover:text-blue-500 cursor-pointer">
                  {city}
                  {loading === city ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  ) : weatherData[city] ? (
                    <i className={`fas fa-${getWeatherIcon(weatherData[city].weather[0].icon)} ${getTemperatureColor(weatherData[city].main.temp)}`}></i>
                  ) : errors[city] ? (
                    <i className="fas fa-exclamation-circle text-red-500" title={errors[city]}></i>
                  ) : (
                    <i className="fas fa-sun text-yellow-500"></i>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(city);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-700 cursor-pointer"
                  title="Eliminar de favoritos"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                    <span className="text-sm font-bold">−</span>
                  </div>
                </button>
              </div>
              
              {/* Panel de detalles para click */}
              <div className={`max-h-0 overflow-hidden transition-all duration-1000 ease-in-out ${expandedCity === city ? 'max-h-96' : ''}`}>
                {loading === city ? (
                  <div className="text-center py-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-600">Cargando datos del clima...</p>
                  </div>
                ) : weatherData[city] ? (
                  <div className="p-4 bg-white border-t space-y-3">
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
                  </div>
                ) : errors[city] ? (
                  <div className="p-4 bg-white border-t">
                    <div className="flex items-center justify-center gap-2 text-red-500">
                      <i className="fas fa-exclamation-circle"></i>
                      <p>{errors[city]}</p>
                    </div>
                    <button
                      onClick={() => fetchWeatherData(city)}
                      className="mt-2 w-full py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2 text-gray-500">
                    No se pudieron cargar los datos del clima
                  </div>
                )}
              </div>
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