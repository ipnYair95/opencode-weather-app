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
