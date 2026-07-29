import type { GeocodingResult } from "../types/City.ts";

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
