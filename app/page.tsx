import WeatherSearch from './components/WeatherSearch';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">
          Aplicación del Clima
        </h1>
        <WeatherSearch />
      </div>
    </main>
  );
}
