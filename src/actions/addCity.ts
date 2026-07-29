import { ask } from "../presentation/input.ts";
import { searchCity } from "../api/geocoding.ts";
import { saveConfig } from "../storage/settingsStorage.ts";
import type { City, Config } from "../types/City.ts";

export async function handleAddCity(config: Config): Promise<void> {
  const name = await ask("\n  Nombre de la ciudad: ");
  if (!name.trim()) {
    console.log("\n  Nombre inválido.");
    return;
  }

  console.log("  Buscando...");
  const result = await searchCity(name.trim());
  if (result === null) {
    console.log("\n  No se encontró ninguna ciudad con ese nombre.");
    return;
  }

  const locationLabel = result.country
    ? `${result.name}, ${result.country}`
    : result.name;
  console.log(`\n  → Se encontró: ${locationLabel}`);

  const answer = await ask("  ¿Agregar a la lista? (s/n): ");
  if (answer.toLowerCase() !== "s") {
    console.log("  Ciudad no agregada.");
    return;
  }

  const city: City = {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
  };

  config.cities.push(city);
  await saveConfig(config);
  console.log(`  ✓ ${result.name} agregada.`);

  if (!config.defaultCity) {
    const setDefault = await ask("  ¿Establecer como ciudad default? (s/n): ");
    if (setDefault.toLowerCase() === "s") {
      config.defaultCity = city;
      await saveConfig(config);
      console.log(`  ✓ Ciudad default actualizada: ${city.name}`);
    }
  }
}
