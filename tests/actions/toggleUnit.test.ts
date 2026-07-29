import { describe, it, expect, mock } from "bun:test";
import type { Config } from "../../src/types/City.ts";

mock.module("../../src/storage/settingsStorage.ts", () => ({
  saveConfig: mock(async () => {}),
  loadConfig: mock(async (): Promise<Config> => ({ defaultCity: null, cities: [], unit: "C" })),
  loadUnit: mock(async () => "C" as const),
  saveUnit: mock(async () => {}),
}));

const { handleToggleUnit } = await import("../../src/actions/toggleUnit.ts");

describe("handleToggleUnit", () => {
  it("toggles from C to F", async () => {
    const config: Config = { unit: "C", cities: [], defaultCity: null };
    await handleToggleUnit(config);
    expect(config.unit).toBe("F");
  });

  it("toggles from F to C", async () => {
    const config: Config = { unit: "F", cities: [], defaultCity: null };
    await handleToggleUnit(config);
    expect(config.unit).toBe("C");
  });
});
