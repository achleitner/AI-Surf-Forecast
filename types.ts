export interface DailyForecast {
  day: string;
  waveHeight: {
    min: number;
    max: number;
  };
  swellPeriod: number;
  windSpeed: number;
  windDirection: string;
  summary: string;
}

export interface SurfForecast {
  locationName: string;
  forecast: DailyForecast[];
}

export interface Coordinates {
  lat: number;
  lon: number;
}
