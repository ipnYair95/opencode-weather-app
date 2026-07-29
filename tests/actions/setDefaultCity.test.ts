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

const { handleSetDefault } = await import("../../src/actions/setDefaultCity.ts");

describe("handleSetDefault", () => {
  beforeEach(() => {
    askResponses = [];
  });

  it("does nothing with empty cities", async () => {
    const config: Config = { cities: [], defaultCity: null, unit: "C" };
    await handleSetDefault(config);
    expect(config.defaultCity).toBeNull();
  });

  it("sets default by valid index", async () => {
    askResponses = ["2"];
    const config: Config = {
      cities: [{ name: "A", latitude: 1, longitude: 1 }, { name: "B", latitude: 2, longitude: 2 }],
      defaultCity: null,
      unit: "C",
    };
    await handleSetDefault(config);
    expect(config.defaultCity?.name).toBe("B");
  });

  it("ignores out-of-range index", async () => {
    askResponses = ["99"];
    const config: Config = {
      cities: [{ name: "A", latitude: 1, longitude: 1 }],
      defaultCity: null,
      unit: "C",
    };
    await handleSetDefault(config);
    expect(config.defaultCity).toBeNull();
  });

  it("ignores NaN index", async () => {
    askResponses = ["abc"];
    const config: Config = {
      cities: [{ name: "A", latitude: 1, longitude: 1 }],
      defaultCity: null,
      unit: "C",
    };
    await handleSetDefault(config);
    expect(config.defaultCity).toBeNull();
  });
});
