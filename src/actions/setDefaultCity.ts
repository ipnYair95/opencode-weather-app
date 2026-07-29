import { ask } from "../presentation/input.ts";
import { saveConfig } from "../storage/settingsStorage.ts";
import type { Config } from "../types/City.ts";

export async function handleSetDefault(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n  No hay ciudades guardadas. Agrega una primero.");
    return;
  }

  console.log("\n  Ciudades guardadas:");
  for (let i = 0; i < config.cities.length; i++) {
    const city = config.cities[i]!;
    console.log(`  ${i + 1}. ${city.name}`);
  }

  const input = await ask("  Número a establecer como default: ");
  const index = parseInt(input, 10) - 1;
  if (isNaN(index) || index < 0 || index >= config.cities.length) {
    console.log("\n  Número inválido.");
    return;
  }

  config.defaultCity = config.cities[index]!;
  await saveConfig(config);
  console.log(`  ✓ Ciudad default actualizada: ${config.defaultCity.name}`);
}
