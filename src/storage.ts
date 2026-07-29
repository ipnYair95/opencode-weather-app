import type { Config } from "./types.ts";

const CONFIG_PATH = `${process.env.HOME}/.weather-cli.json`;

export async function loadConfig(): Promise<Config> {
  try {
    const file = Bun.file(CONFIG_PATH);
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
    await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error("Error al guardar la configuración:", error);
  }
}

function defaultConfig(): Config {
  return {
    defaultCity: null,
    cities: [],
    unit: "C",
  };
}
