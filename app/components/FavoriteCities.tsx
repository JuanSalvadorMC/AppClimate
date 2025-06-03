'use client';

interface FavoriteCitiesProps {
  onSelectCity: (city: string) => void;
  favorites: string[];
  onFavoritesChange: (favorites: string[]) => void;
}

export default function FavoriteCities({ onSelectCity, favorites, onFavoritesChange }: FavoriteCitiesProps) {
  const removeFavorite = (cityToRemove: string) => {
    const updatedFavorites = favorites.filter(city => city !== cityToRemove);
    onFavoritesChange(updatedFavorites);
    localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
      <h3 className="text-xl font-bold mb-4">Ciudades Favoritas</h3>
      
      {favorites.length > 0 ? (
        <div className="space-y-2">
          {favorites.map((city) => (
            <div
              key={city}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <button
                onClick={() => onSelectCity(city)}
                className="flex-1 text-left hover:text-blue-500"
              >
                {city}
              </button>
              <button
                onClick={() => removeFavorite(city)}
                className="p-1 text-red-500 hover:text-red-700"
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