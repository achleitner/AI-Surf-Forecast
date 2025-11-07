import React from 'react';
import { SurfForecast, DailyForecast } from '../types';
import { WaveIcon, WindIcon, SwellIcon } from './icons';

interface ForecastPanelProps {
  forecastData: SurfForecast | null;
  onClose: () => void;
}

const ForecastCard: React.FC<{ dayForecast: DailyForecast }> = ({ dayForecast }) => (
    <div className="bg-blue-900/50 backdrop-blur-sm p-4 rounded-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
        <p className="font-bold text-xl text-cyan-300">{dayForecast.day}</p>
        <div className="my-3 flex items-center space-x-2">
            <WaveIcon className="w-8 h-8 text-cyan-400" />
            <p className="text-2xl font-semibold">{dayForecast.waveHeight.min}-{dayForecast.waveHeight.max}m</p>
        </div>
        <div className="text-sm space-y-2 text-blue-200">
            <div className="flex items-center justify-center space-x-2">
                <SwellIcon className="w-4 h-4" />
                <span>{dayForecast.swellPeriod}s Swell</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
                <WindIcon className="w-4 h-4" />
                <span>{dayForecast.windSpeed}kt {dayForecast.windDirection}</span>
            </div>
        </div>
        <p className="mt-3 text-xs text-blue-100/80 leading-tight">{dayForecast.summary}</p>
    </div>
);


const ForecastPanel: React.FC<ForecastPanelProps> = ({ forecastData, onClose }) => {
  if (!forecastData) {
    return null;
  }

  return (
    <div className="relative w-full bg-black/30 backdrop-blur-md p-4 md:p-6 text-white animate-fade-in-up rounded-xl">
        <button 
            onClick={onClose} 
            aria-label="Close forecast"
            className="absolute top-2 right-2 p-2 text-blue-200 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-4 text-center md:text-left">
                Surf Forecast: <span className="text-white font-semibold">{forecastData.locationName}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                {forecastData.forecast.map((day, index) => (
                    <ForecastCard key={index} dayForecast={day} />
                ))}
            </div>
        </div>
    </div>
  );
};

export default ForecastPanel;