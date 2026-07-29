import type { City, DailyForecast, GeocodingResult, WeatherData } from "./types.ts";

export async function searchCity(name: string): Promise<GeocodingResult | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=es&format=json`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json() as { results?: Array<{ name: string; latitude: number; longitude: number; country?: string }> };
  if (!data.results || data.results.length === 0) return null;

  const result = data.results[0]!;
  return {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
  };
}

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

export function weatherDescription(code: number): string {
  if (code === 0) return "☀️ Despejado";
  if (code <= 2) return "⛅ Parcialmente nublado";
  if (code === 3) return "☁️ Nublado";
  if (code === 45 || code === 48) return "🌫️ Niebla";
  if (code >= 51 && code <= 57) return "🌦️ Llovizna";
  if (code >= 61 && code <= 67) return "🌧️ Lluvia";
  if (code >= 71 && code <= 77) return "❄️ Nieve";
  if (code >= 80 && code <= 82) return "🌦️ Chubascos";
  if (code >= 85 && code <= 86) return "🌨️ Nevadas";
  if (code >= 95) return "⛈️ Tormenta";
  return "❓ Desconocido";
}
