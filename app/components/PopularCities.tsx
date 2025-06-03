'use client';

interface PopularCitiesProps {
  onCityClick: (city: string) => void;
}

export default function PopularCities({ onCityClick }: PopularCitiesProps) {
  const popularCities = [
    { name: 'París', country: 'Francia', continent: 'Europa' },
    { name: 'Nueva York', country: 'Estados Unidos', continent: 'América' },
    { name: 'Tokio', country: 'Japón', continent: 'Asia' },
    { name: 'Sídney', country: 'Australia', continent: 'Oceanía' },
    { name: 'El Cairo', country: 'Egipto', continent: 'África' },
    { name: 'Roma', country: 'Italia', continent: 'Europa' },
    { name: 'Londres', country: 'Reino Unido', continent: 'Europa' },
    { name: 'Madrid', country: 'España', continent: 'Europa' },
    { name: 'Barcelona', country: 'España', continent: 'Europa' },
    { name: 'Ciudad de México', country: 'México', continent: 'América' },
    { name: 'Singapur', country: 'Singapur', continent: 'Asia' },
    { name: 'Toronto', country: 'Canadá', continent: 'América' }
  ];

  const continents = Array.from(new Set(popularCities.map(city => city.continent)));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-gray-600 mb-4">Descubre el clima en estas ciudades famosas:</p>

      <div className="space-y-4">
        {continents.map(continent => (
          <div key={continent}>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              {continent}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {popularCities
                .filter(city => city.continent === continent)
                .map(city => (
                  <button
                    key={city.name}
                    onClick={() => onCityClick(city.name)}
                    className="text-left hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                  >
                    <span className="font-medium">
                      {city.name}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {city.country}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 