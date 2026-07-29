import { describe, it, expect, mock, beforeEach } from "bun:test";
import type { Config } from "../../src/types/City.ts";

let askResponses: string[] = [];

mock.module("../../src/presentation/input.ts", () => ({
  ask: mock(async () => askResponses.shift() ?? ""),
  closeReadline: mock(() => {}),
}));

mock.module("../../src/storage/settingsStorage.ts", () => ({
  saveConfig: mock(async () => {}),
  loadConfig: mock(async (): Promise<Config> => ({ defaultCity: null, cities: [], unit: "C" })),
  loadUnit: mock(async () => "C" as const),
  saveUnit: mock(async () => {}),
}));

const { handleRemoveCity } = await import("../../src/actions/removeCity.ts");

describe("handleRemoveCity", () => {
  beforeEach(() => {
    askResponses = [];
  });

  it("does nothing with empty cities", async () => {
    const config: Config = { cities: [], defaultCity: null, unit: "C" };
    await handleRemoveCity(config);
    expect(config.cities).toHaveLength(0);
  });

  it("removes city by index", async () => {
    askResponses = ["1"];
    const config: Config = {
      cities: [{ name: "A", latitude: 1, longitude: 1 }, { name: "B", latitude: 2, longitude: 2 }],
      defaultCity: null,
      unit: "C",
    };
    await handleRemoveCity(config);
    expect(config.cities).toHaveLength(1);
    expect(config.cities[0]?.name).toBe("B");
  });

  it("clears defaultCity when removed city was default", async () => {
    askResponses = ["1"];
    const city = { name: "A", latitude: 1, longitude: 1 };
    const config: Config = { cities: [city], defaultCity: city, unit: "C" };
    await handleRemoveCity(config);
    expect(config.cities).toHaveLength(0);
    expect(config.defaultCity).toBeNull();
  });

  it("handles NaN index", async () => {
    askResponses = ["abc"];
    const config: Config = {
      cities: [{ name: "A", latitude: 1, longitude: 1 }],
      defaultCity: null,
      unit: "C",
    };
    await handleRemoveCity(config);
    expect(config.cities).toHaveLength(1);
  });

  it("handles out-of-range index", async () => {
    askResponses = ["99"];
    const config: Config = {
      cities: [{ name: "A", latitude: 1, longitude: 1 }],
      defaultCity: null,
      unit: "C",
    };
    await handleRemoveCity(config);
    expect(config.cities).toHaveLength(1);
  });
});
