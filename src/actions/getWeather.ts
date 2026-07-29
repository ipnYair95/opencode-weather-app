import { getWeather, getWeeklyForecast } from "../api/weather.ts";
import { weatherDescription } from "../utils/constants.ts";
import { formatDayName, formatDate } from "../utils/format.ts";
import { yellow, red, reset } from "../utils/colors.ts";
import type { City, Config } from "../types/City.ts";

async function showWeather(city: City, unit: "C" | "F"): Promise<void> {
  const weather = await getWeather(city, unit);
  if (weather === null) {
    console.log(`\n  ${red}✗${reset} Error al obtener el clima de ${city.name}`);
  } else {
    console.log(`\n  📍 ${city.name}: ${yellow}${weather.temperature}${weather.unit}${reset}`);
  }
}

export async function handleDefaultCity(config: Config): Promise<void> {
  if (!config.defaultCity) {
    console.log("\n  No hay ciudad default configurada.");
    return;
  }
  await showWeather(config.defaultCity, config.unit);
}

export async function handleAllCities(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n  No hay ciudades guardadas.");
    return;
  }
  for (const city of config.cities) {
    await showWeather(city, config.unit);
  }
}

export async function handleAllCitiesForecast(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n  No hay ciudades guardadas.");
    return;
  }

  for (const city of config.cities) {
    const forecast = await getWeeklyForecast(city, config.unit);
    if (forecast === null) {
      console.log(`\n  ${red}✗${reset} Error al obtener pronóstico de ${city.name}`);
      continue;
    }

    console.log(`\n  📍 ${city.name}`);
    console.log(`  ${"─".repeat(40)}`);
    for (const day of forecast) {
      const dayName = formatDayName(day.date);
      const dateStr = formatDate(day.date);
      console.log(`  📅 ${dayName} ${dateStr}  ${weatherDescription(day.weatherCode)}  ${yellow}${day.tempMax}º${reset} / ${day.tempMin}º`);
    }
  }
}
