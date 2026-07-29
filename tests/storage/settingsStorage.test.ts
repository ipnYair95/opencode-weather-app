import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import type { Config } from "../../src/types/City.ts";

const { loadConfig, saveConfig, loadUnit, saveUnit } = await import("../../src/storage/settingsStorage.ts");

function tmpHome(): string {
  return mkdtempSync(join(tmpdir(), "weather-test-")).replace(/\\/g, "/");
}

describe("settingsStorage", () => {
  let tmpDir: string;
  let origDir: string | undefined;

  beforeEach(() => {
    tmpDir = tmpHome();
    origDir = (globalThis as { __WEATHER_CLI_DIR?: string }).__WEATHER_CLI_DIR;
    (globalThis as { __WEATHER_CLI_DIR?: string }).__WEATHER_CLI_DIR = tmpDir;
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
    (globalThis as { __WEATHER_CLI_DIR?: string }).__WEATHER_CLI_DIR = origDir;
  });

  it("loadConfig returns default when file does not exist", async () => {
    const config = await loadConfig();
    expect(config.defaultCity).toBeNull();
    expect(config.cities).toEqual([]);
    expect(config.unit).toBe("C");
  });

  it("loadConfig reads existing config file", async () => {
    const data = {
      defaultCity: { name: "Ottawa", latitude: 45.41, longitude: -75.69 },
      cities: [],
      unit: "F",
    };
    writeFileSync(`${tmpDir}/.weather-cli.json`, JSON.stringify(data));
    const config = await loadConfig();
    expect(config.defaultCity?.name).toBe("Ottawa");
    expect(config.unit).toBe("F");
  });

  it("saveConfig writes config to disk", async () => {
    const config: Config = {
      defaultCity: null,
      cities: [{ name: "Toronto", latitude: 43.65, longitude: -79.38 }],
      unit: "C",
    };
    await saveConfig(config);
    const filePath = `${tmpDir}/.weather-cli.json`;
    expect(existsSync(filePath)).toBe(true);
    const saved = JSON.parse(readFileSync(filePath, "utf-8"));
    expect(saved.cities).toHaveLength(1);
    expect(saved.cities[0].name).toBe("Toronto");
    expect(saved.unit).toBe("C");
  });

  it("loadUnit returns 'C' by default", async () => {
    const unit = await loadUnit();
    expect(unit).toBe("C");
  });

  it("saveUnit persists unit and loadUnit reads it back", async () => {
    await saveUnit("F");
    const unit = await loadUnit();
    expect(unit).toBe("F");
  });
});
