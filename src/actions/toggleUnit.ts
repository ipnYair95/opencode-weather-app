import { saveConfig } from "../storage/settingsStorage.ts";
import type { Config } from "../types/City.ts";

export async function handleToggleUnit(config: Config): Promise<void> {
  config.unit = config.unit === "C" ? "F" : "C";
  await saveConfig(config);
  console.log(`\n  Unidad cambiada a °${config.unit}`);
}
