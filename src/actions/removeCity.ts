import { ask } from "../presentation/input.ts";
import { saveConfig } from "../storage/settingsStorage.ts";
import type { Config } from "../types/City.ts";

export async function handleRemoveCity(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n  No hay ciudades guardadas.");
    return;
  }

  console.log("\n  Ciudades guardadas:");
  for (let i = 0; i < config.cities.length; i++) {
    const city = config.cities[i]!;
    console.log(`  ${i + 1}. ${city.name}`);
  }

  const input = await ask("  Número a eliminar: ");
  const index = parseInt(input, 10) - 1;
  if (isNaN(index) || index < 0 || index >= config.cities.length) {
    console.log("\n  Número inválido.");
    return;
  }

  const removed = config.cities[index]!;
  config.cities.splice(index, 1);

  if (config.defaultCity && config.defaultCity.name === removed.name) {
    config.defaultCity = null;
  }

  await saveConfig(config);
  console.log(`  ✓ ${removed.name} eliminada.`);
}
