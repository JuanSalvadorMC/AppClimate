'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import PopularCities from './PopularCities';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  dt: number;
}

interface ForecastData {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
}

interface WeatherSearchProps {
  initialCity?: string;
  onAddToFavorites?: (city: string) => void;
  favorites?: string[];
}

export default function WeatherSearch({ initialCity, onAddToFavorites, favorites = [] }: WeatherSearchProps) {
  const [city, setCity] = useState(initialCity || '');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const API_KEY = '729d536913428102ed055faf12ed693b';

  const getCitySuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (city.trim()) {
        getCitySuggestions(city);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [city]);

  useEffect(() => {
    if (initialCity && initialCity !== city) {
      setCity(initialCity);
      searchWeather(initialCity);
    }
  }, [initialCity]);

  const searchWeather = async (cityName: string) => {
    if (!cityName.trim()) {
      setError('Por favor, ingresa el nombre de una ciudad');
      return;
    }

    setLoading(true);
    setError('');
    setShowSuggestions(false);

    try {
      // Obtener clima actual
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`
      );
      setWeather(weatherResponse.data);

      // Obtener pronóstico de 5 días
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`
      );
      console.log('Datos del pronóstico:', forecastResponse.data.list);
      setForecast(forecastResponse.data.list);
    } catch (err) {
      console.error('Error en la búsqueda:', err);
      setError('Ciudad no encontrada. Por favor, intenta con otro nombre.');
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: CitySuggestion) => {
    setCity(suggestion.name);
    searchWeather(suggestion.name);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric'
    });
  };

  const getChartData = () => {
    // Tomar solo un pronóstico por día (cada 8 elementos, ya que la API devuelve datos cada 3 horas)
    const dailyForecasts = forecast.filter((_, index) => index % 8 === 0);
    
    const chartData = dailyForecasts.map(item => ({
      date: formatDate(item.dt),
      tempMax: Math.round(item.main.temp_max),
      tempMin: Math.round(item.main.temp_min)
    }));

    return chartData;
  };

  const handleAddToFavorites = () => {
    if (weather && onAddToFavorites) {
      onAddToFavorites(weather.name);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    // Mapeo de códigos de OpenWeatherMap a clases de Font Awesome
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

  const isFavorite = weather ? favorites.includes(weather.name) : false;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Buscar ciudad..."
              className="w-full p-2 pr-10 border-none border-b border-gray-500 rounded-none focus:outline-none focus:ring-0 focus:border-gray-500"
              style={{ borderBottom: '1px solid gray' }}
            />
            {city && (
              <button
                onClick={() => {
                  setCity('');
                  setWeather(null);
                  setForecast([]);
                  setError('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300 cursor-pointer p-1"
                title="Limpiar búsqueda"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            )}
          </div>
          <button
            onClick={() => searchWeather(city)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Buscar
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white rounded-lg shadow-lg border border-gray-200 mt-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.name}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-map-marker-alt text-gray-400"></i>
                <div>
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-gray-500">
                    {suggestion.state ? `${suggestion.state}, ` : ''}
                    {suggestion.country}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {!weather && !loading && (
        <PopularCities onCityClick={(city) => {
          setCity(city);
          searchWeather(city);
        }} />
      )}

      {weather && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setWeather(null);
                setForecast([]);
                setCity('');
              }}
              className="p-0 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              title="Cerrar"
            >
              <i className="fas fa-times text-3xl"></i>
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">{weather.name}</h2>
                <p className="text-2xl font-bold capitalize text-gray-600">
                  {weather.weather[0].description}
                </p>
              </div>
              <i className={`fas fa-${getWeatherIcon(weather.weather[0].icon)} text-4xl text-blue-500`}></i>
            </div>
            <button
              onClick={handleAddToFavorites}
              className="p-2 text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <i className={`fas fa-heart text-4xl ${isFavorite ? 'text-red-500' : 'text-gray-300'} hover:text-red-600 transition-colors`}></i>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600">Temperatura</p>
              <p className="text-2xl font-semibold">{Math.round(weather.main.temp)}°C</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600">Sensación térmica</p>
              <p className="text-2xl font-semibold">{Math.round(weather.main.feels_like)}°C</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600">Humedad</p>
              <p className="text-2xl font-semibold">{weather.main.humidity}%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600">Viento</p>
              <p className="text-2xl font-semibold">{weather.wind.speed} m/s</p>
            </div>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Pronóstico de 5 días</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getChartData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: 'Temperatura (°C)',
                    angle: -90,
                    position: 'insideLeft'
                  }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}°C`, '']}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tempMax"
                  stroke="#EF4444"
                  name="Temperatura Máxima"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="tempMin"
                  stroke="#3B82F6"
                  name="Temperatura Mínima"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
} 