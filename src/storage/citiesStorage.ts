import type { City } from "../types/City.ts";
import { loadConfig, saveConfig } from "./settingsStorage.ts";

export async function loadCities(): Promise<City[]> {
  const config = await loadConfig();
  return config.cities;
}

export async function saveCities(cities: City[]): Promise<void> {
  const config = await loadConfig();
  config.cities = cities;
  await saveConfig(config);
}

export async function getDefaultCity(): Promise<City | null> {
  const config = await loadConfig();
  return config.defaultCity;
}

export async function setDefaultCity(city: City | null): Promise<void> {
  const config = await loadConfig();
  config.defaultCity = city;
  await saveConfig(config);
}
