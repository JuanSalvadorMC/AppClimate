'use client';

import WeatherSearch from './components/WeatherSearch';
import FavoriteCities from './components/FavoriteCities';
import { useState, useEffect } from 'react';

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Cargar favoritos del localStorage al iniciar
    const savedFavorites = localStorage.getItem('favoriteCities');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleAddToFavorites = (city: string) => {
    if (!favorites.includes(city)) {
      const updatedFavorites = [...favorites, city];
      setFavorites(updatedFavorites);
      localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
    }
  };

  return (
    <main className="min-h-screen from-blue-100 to-blue-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl text-center mb-8 text-blue-800">
          Aplicación del Clima
        </h1>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <WeatherSearch 
              onAddToFavorites={handleAddToFavorites}
              favorites={favorites}
            />
          </div>
          <div className="col-span-4">
            <FavoriteCities 
              favorites={favorites}
              onFavoritesChange={setFavorites}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
