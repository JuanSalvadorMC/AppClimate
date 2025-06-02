'use client';

import { useState } from 'react';
import axios from 'axios';

interface WeatherData {
  name: string;
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

export default function WeatherSearch() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '729d536913428102ed055faf12ed693b';

  const searchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );
      setWeather(response.data);
    } catch (err) {
      setError('Ciudad no encontrada. Por favor, intenta con otro nombre.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={searchWeather} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ingresa el nombre de la ciudad"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
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
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{weather.name}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Temperatura</p>
              <p className="text-2xl font-semibold">{Math.round(weather.main.temp)}°C</p>
            </div>
            <div>
              <p className="text-gray-600">Sensación térmica</p>
              <p className="text-2xl font-semibold">{Math.round(weather.main.feels_like)}°C</p>
            </div>
            <div>
              <p className="text-gray-600">Humedad</p>
              <p className="text-2xl font-semibold">{weather.main.humidity}%</p>
            </div>
            <div>
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
    </div>
  );
} 