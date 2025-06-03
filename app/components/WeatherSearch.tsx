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

type ChartDataType = 'temperature' | 'humidity' | 'wind';

interface DailyForecast {
  date: string;
  temperatura: number;
  tempMin: number;
  tempMax: number;
  humedad: number;
  viento: number;
}

interface WeatherSearchProps {
  initialCity?: string;
  onAddToFavorites?: (city: string) => void;
}

export default function WeatherSearch({ initialCity, onAddToFavorites }: WeatherSearchProps) {
  const [city, setCity] = useState(initialCity || '');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [chartType, setChartType] = useState<ChartDataType>('temperature');

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
    if (initialCity) {
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
      temperatura: Math.round(item.main.temp),
      tempMin: Math.round(item.main.temp_min),
      tempMax: Math.round(item.main.temp_max),
      humedad: item.main.humidity,
      viento: item.wind.speed
    }));

    console.log('Datos para el gráfico:', chartData);
    return chartData;
  };

  const handleAddToFavorites = () => {
    if (weather && onAddToFavorites) {
      onAddToFavorites(weather.name);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          searchWeather(city);
        }} 
        className="mb-4 relative"
      >
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Ingresa el nombre de la ciudad"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="font-medium">{suggestion.name}</div>
                    <div className="text-sm text-gray-500">
                      {suggestion.state ? `${suggestion.state}, ` : ''}
                      {suggestion.country}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !city.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">
          {error}
        </div>
      )}

      {weather && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{weather.name}</h2>
            <div className="flex items-center gap-2">
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="w-16 h-16"
              />
              <button
                onClick={handleAddToFavorites}
                className="p-2 text-red-500 hover:text-red-600 transition-colors"
                title="Agregar a favoritos"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
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
          <div className="mt-4">
            <p className="text-gray-600">Condición</p>
            <p className="text-xl capitalize">{weather.weather[0].description}</p>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Pronóstico de 5 días</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('temperature')}
                className={`px-3 py-1 rounded ${
                  chartType === 'temperature' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Temperatura
              </button>
              <button
                onClick={() => setChartType('humidity')}
                className={`px-3 py-1 rounded ${
                  chartType === 'humidity' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Humedad
              </button>
              <button
                onClick={() => setChartType('wind')}
                className={`px-3 py-1 rounded ${
                  chartType === 'wind' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                Viento
              </button>
            </div>
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
                  label={{ value: 'Temperatura (°C)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}°C`, '']}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Legend />
                {chartType === 'temperature' && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="temperatura"
                      stroke="#3B82F6"
                      name="Temperatura Actual"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tempMin"
                      stroke="#60A5FA"
                      name="Temperatura Mínima"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="tempMax"
                      stroke="#2563EB"
                      name="Temperatura Máxima"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </>
                )}
                {chartType === 'humidity' && (
                  <Line
                    type="monotone"
                    dataKey="humedad"
                    stroke="#10B981"
                    name="Humedad (%)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {chartType === 'wind' && (
                  <Line
                    type="monotone"
                    dataKey="viento"
                    stroke="#6366F1"
                    name="Velocidad del viento (m/s)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
} 