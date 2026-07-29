import { readFile, writeFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";
import type { Config } from "../types/City.ts";

export let _configDir: string | undefined;

export function setConfigDir(dir: string | undefined): void {
  _configDir = dir;
}

function configPath(): string {
  const dir = _configDir ?? homedir();
  return join(dir, ".weather-cli.json");
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
