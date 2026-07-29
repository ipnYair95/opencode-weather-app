export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Config {
  defaultCity: City | null;
  cities: City[];
  unit: "C" | "F";
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

export interface WeatherData {
  temperature: number;
  unit: string;
}

export interface DailyForecast {
  date: Date;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  unit: string;
}
