import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import type { Config } from "../../src/types/City.ts";

let askResponses: string[] = [];
let fetchResponse: object | null = null;

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

const { handleAddCity } = await import("../../src/actions/addCity.ts");

describe("handleAddCity", () => {
  let origFetch: typeof globalThis.fetch;

  beforeEach(() => {
    askResponses = [];
    origFetch = globalThis.fetch;
    globalThis.fetch = (async (url: string) => {
      if (fetchResponse === null) {
        return new Response(JSON.stringify({ results: [] }), { status: 200 });
      }
      return new Response(JSON.stringify(fetchResponse), { status: 200 });
    }) as unknown as typeof globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = origFetch;
  });

  it("adds a city and sets as default when user agrees", async () => {
    askResponses = ["Ottawa", "s", "s"];
    fetchResponse = {
      results: [{ name: "Ottawa", latitude: 45.41117, longitude: -75.69812, country: "Canadá" }],
    };
    const config: Config = { defaultCity: null, cities: [], unit: "C" };
    await handleAddCity(config);
    expect(config.cities).toHaveLength(1);
    expect(config.cities[0]?.name).toBe("Ottawa");
    expect(config.defaultCity?.name).toBe("Ottawa");
  });

  it("adds a city without setting as default", async () => {
    askResponses = ["Toronto", "s", "n"];
    fetchResponse = {
      results: [{ name: "Toronto", latitude: 43.65, longitude: -79.38, country: "Canadá" }],
    };
    const config: Config = { defaultCity: null, cities: [], unit: "C" };
    await handleAddCity(config);
    expect(config.cities).toHaveLength(1);
    expect(config.cities[0]?.name).toBe("Toronto");
    expect(config.defaultCity).toBeNull();
  });

  it("does not add city when search returns no results", async () => {
    askResponses = ["Nowhere"];
    fetchResponse = { results: [] };
    const config: Config = { defaultCity: null, cities: [], unit: "C" };
    await handleAddCity(config);
    expect(config.cities).toHaveLength(0);
  });

  it("does not add city when user declines", async () => {
    askResponses = ["Ottawa", "n"];
    fetchResponse = {
      results: [{ name: "Ottawa", latitude: 45.41117, longitude: -75.69812, country: "Canadá" }],
    };
    const config: Config = { defaultCity: null, cities: [], unit: "C" };
    await handleAddCity(config);
    expect(config.cities).toHaveLength(0);
  });

  it("handles empty name", async () => {
    askResponses = [""];
    const config: Config = { defaultCity: null, cities: [], unit: "C" };
    await handleAddCity(config);
    expect(config.cities).toHaveLength(0);
  });
});
