import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import { WeatherData } from './types/weather';

const API_KEY = '729d536913428102ed055faf12ed693b'; // Reemplaza con tu API key de OpenWeatherMap
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Cargar favoritos del localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleSearch = async (city: string) => {
    try {
      setError('');
      const response = await axios.get(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}`
      );
      setWeather(response.data);
    } catch (err) {
      setError('Ciudad no encontrada. Por favor, intenta con otro nombre.');
      setWeather(null);
    }
  };

  const handleAddToFavorites = () => {
    if (weather) {
      const cityKey = `${weather.name},${weather.sys.country}`;
      const newFavorites = favorites.includes(cityKey)
        ? favorites.filter(fav => fav !== cityKey)
        : [...favorites, cityKey];
      
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  };

  const isFavorite = weather
    ? favorites.includes(`${weather.name},${weather.sys.country}`)
    : false;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Aplicación del Clima
        </h1>
        
        <SearchBar onSearch={handleSearch} />
        
        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}
        
        {weather && (
          <WeatherCard
            weather={weather}
            onAddToFavorites={handleAddToFavorites}
            isFavorite={isFavorite}
          />
        )}
        
        {favorites.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Ciudades Favoritas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((fav) => (
                <div
                  key={fav}
                  className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md"
                  onClick={() => handleSearch(fav.split(',')[0])}
                >
                  {fav}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
