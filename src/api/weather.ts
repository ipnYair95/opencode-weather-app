import type { City } from "../types/City.ts";
import type { DailyForecast, WeatherData } from "../types/Weather.ts";

export async function getWeather(city: City, unit: "C" | "F"): Promise<WeatherData | null> {
  const tempUnit = unit === "F" ? "fahrenheit" : "celsius";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m&temperature_unit=${tempUnit}`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json() as {
    current?: { temperature_2m: number };
    current_units?: { temperature_2m: string };
  };

  if (data.current === undefined || data.current_units === undefined) return null;

  return {
    temperature: data.current.temperature_2m,
    unit: data.current_units.temperature_2m,
  };
}

export async function getWeeklyForecast(city: City, unit: "C" | "F"): Promise<DailyForecast[] | null> {
  const tempUnit = unit === "F" ? "fahrenheit" : "celsius";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7&temperature_unit=${tempUnit}`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json() as {
    daily?: {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      weather_code: number[];
    };
    daily_units?: { temperature_2m_max: string };
  };

  if (!data.daily || !data.daily_units) return null;

  const days: DailyForecast[] = [];
  for (let i = 0; i < data.daily.time.length; i++) {
    days.push({
      date: new Date(data.daily.time[i]!),
      tempMax: data.daily.temperature_2m_max[i]!,
      tempMin: data.daily.temperature_2m_min[i]!,
      weatherCode: data.daily.weather_code[i]!,
      unit: data.daily_units.temperature_2m_max,
    });
  }

  return days;
}
