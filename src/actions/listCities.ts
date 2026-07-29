import type { Config } from "../types/City.ts";

export async function handleListCities(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n  No hay ciudades guardadas.");
    return;
  }

  console.log("\n  Ciudades guardadas:");
  for (let i = 0; i < config.cities.length; i++) {
    const city = config.cities[i]!;
    const defaultMark = config.defaultCity?.name === city.name ? " (default)" : "";
    console.log(`  ${i + 1}. ${city.name}${defaultMark}`);
  }
}
