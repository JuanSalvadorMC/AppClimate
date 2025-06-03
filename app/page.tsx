'use client';

import WeatherSearch from './components/WeatherSearch';
import FavoriteCities from './components/FavoriteCities';
import { useState } from 'react';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState('');

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">
          Aplicación del Clima
        </h1>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <WeatherSearch initialCity={selectedCity} />
          </div>
          <div className="col-span-4">
            <FavoriteCities onSelectCity={handleCitySelect} />
          </div>
        </div>
      </div>
    </main>
  );
}
