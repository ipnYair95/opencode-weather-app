import type { Config } from "../types/City.ts";

function configPath(): string {
  return `${process.env.HOME}/.weather-cli.json`;
}

function defaultConfig(): Config {
  return {
    defaultCity: null,
    cities: [],
    unit: "C",
  };
}

export async function loadConfig(): Promise<Config> {
  try {
    const file = Bun.file(configPath());
    const exists = await file.exists();
    if (!exists) return defaultConfig();

    const text = await file.text();
    return JSON.parse(text) as Config;
  } catch {
    return defaultConfig();
  }
}

export async function saveConfig(config: Config): Promise<void> {
  try {
    await Bun.write(configPath(), JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("Error al guardar la configuración:", error);
  }
}

export async function loadUnit(): Promise<"C" | "F"> {
  const config = await loadConfig();
  return config.unit;
}

export async function saveUnit(unit: "C" | "F"): Promise<void> {
  const config = await loadConfig();
  config.unit = unit;
  await saveConfig(config);
}
