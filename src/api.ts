import type { City, GeocodingResult, WeatherData } from "./types.ts";

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
