import { readFile, writeFile } from "fs/promises";
import type { Config } from "../types/City.ts";

function configPath(): string {
  const dir = (globalThis as { __WEATHER_CLI_DIR?: string }).__WEATHER_CLI_DIR
    ?? process.env.WEATHER_CLI_CONFIG_DIR
    ?? process.env.HOME
    ?? process.env.USERPROFILE;
  return `${dir}/.weather-cli.json`;
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
    const text = await readFile(configPath(), "utf-8");
    return JSON.parse(text) as Config;
  } catch {
    return defaultConfig();
  }
}

export async function saveConfig(config: Config): Promise<void> {
  try {
    await writeFile(configPath(), JSON.stringify(config, null, 2), "utf-8");
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
