import React, { useState, useCallback } from 'react';
import Globe from './components/Globe';
import ForecastPanel from './components/ForecastPanel';
import LoadingSpinner from './components/LoadingSpinner';
import { getSurfForecast } from './services/geminiService';
import { SurfForecast, Coordinates } from './types';

const App: React.FC = () => {
  const [forecast, setForecast] = useState<SurfForecast | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const handleSelectLocation = useCallback(async (coords: Coordinates) => {
    setShowIntro(false);
    setIsLoading(true);
    setForecast(null);
    setError(null);

    try {
      const forecastData = await getSurfForecast(coords);
      setForecast(forecastData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleCloseForecast = useCallback(() => {
    setForecast(null);
    setError(null);
    setShowIntro(true);
  }, []);

  return (
    <main className="relative h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      
      <div className="relative z-10 flex flex-col h-full p-4">
        <header className="text-center shrink-0">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
            AI Surf Forecaster
          </h1>
          <p className="text-blue-200 mt-2 max-w-2xl mx-auto">
            Click to get a forecast. Drag to rotate. Pinch or scroll to zoom.
          </p>
        </header>

        <div className="flex-1 flex items-center justify-center min-h-0 py-4">
            <div className="w-full max-w-[600px] aspect-square relative">
                <Globe onSelectLocation={handleSelectLocation} isLoading={isLoading} />
            </div>
        </div>
        
        <footer className="shrink-0 flex items-center justify-center min-h-[100px]">
            {isLoading && <LoadingSpinner />}
            {error && <div className="bg-red-500/50 backdrop-blur-sm p-4 rounded-lg text-center max-w-md mx-auto">{error}</div>}
            {showIntro && !isLoading && !error && (
              <div className="text-center text-blue-200 animate-pulse">
                <p>Click the globe to begin...</p>
              </div>
            )}
            {forecast && <ForecastPanel forecastData={forecast} onClose={handleCloseForecast} />}
        </footer>
      </div>
    </main>
  );
};

export default App;