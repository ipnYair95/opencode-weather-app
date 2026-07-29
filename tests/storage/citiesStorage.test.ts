import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const { setConfigDir } = await import("../../src/storage/settingsStorage.ts");
const { loadCities, saveCities, getDefaultCity, setDefaultCity } = await import("../../src/storage/citiesStorage.ts");

describe("citiesStorage", () => {
  let tmpHome: string;

  beforeEach(() => {
    tmpHome = mkdtempSync(join(tmpdir(), "weather-test-"));
    setConfigDir(tmpHome);
  });

  afterEach(() => {
    rmSync(tmpHome, { recursive: true, force: true });
    setConfigDir(undefined);
  });

  it("loadCities returns empty array by default", async () => {
    const cities = await loadCities();
    expect(cities).toEqual([]);
  });

  it("saveCities and loadCities round-trip", async () => {
    const cities = [
      { name: "Ottawa", latitude: 45.41, longitude: -75.69 },
      { name: "Toronto", latitude: 43.65, longitude: -79.38 },
    ];
    await saveCities(cities);
    const loaded = await loadCities();
    expect(loaded).toHaveLength(2);
    expect(loaded[0]!.name).toBe("Ottawa");
    expect(loaded[1]!.name).toBe("Toronto");
  });

  it("getDefaultCity returns null when not set", async () => {
    const city = await getDefaultCity();
    expect(city).toBeNull();
  });

  it("setDefaultCity and getDefaultCity round-trip", async () => {
    const city = { name: "Ottawa", latitude: 45.41, longitude: -75.69 };
    await setDefaultCity(city);
    const loaded = await getDefaultCity();
    expect(loaded).not.toBeNull();
    expect(loaded!.name).toBe("Ottawa");
  });

  it("setDefaultCity(null) clears default", async () => {
    const city = { name: "Ottawa", latitude: 45.41, longitude: -75.69 };
    await setDefaultCity(city);
    await setDefaultCity(null);
    const loaded = await getDefaultCity();
    expect(loaded).toBeNull();
  });
});
