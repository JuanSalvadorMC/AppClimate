import React from 'react';
import { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weather: WeatherData;
  onAddToFavorites: () => void;
  isFavorite: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onAddToFavorites, isFavorite }) => {
  const temperature = Math.round(weather.main.temp - 273.15); // Convertir de Kelvin a Celsius

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="text-gray-600">{weather.weather[0].description}</p>
        </div>
        <button
          onClick={onAddToFavorites}
          className={`p-2 rounded-full ${
            isFavorite ? 'text-yellow-500' : 'text-gray-400'
          } hover:text-yellow-500`}
        >
          ★
        </button>
      </div>

      <div className="mt-4">
        <div className="text-4xl font-bold text-gray-800">{temperature}°C</div>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Sensación térmica</p>
            <p className="font-semibold">{Math.round(weather.main.feels_like - 273.15)}°C</p>
          </div>
          <div>
            <p className="text-gray-600">Humedad</p>
            <p className="font-semibold">{weather.main.humidity}%</p>
          </div>
          <div>
            <p className="text-gray-600">Viento</p>
            <p className="font-semibold">{weather.wind.speed} m/s</p>
          </div>
          <div>
            <p className="text-gray-600">Presión</p>
            <p className="font-semibold">{weather.main.pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard; 