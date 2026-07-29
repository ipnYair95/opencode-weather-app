import { describe, it, expect } from "bun:test";
import { formatDate, formatDayName, formatTemperature } from "../../src/utils/format.ts";

describe("formatDate", () => {
  it("formats a date as DD/MM", () => {
    const date = new Date(2026, 6, 29);
    expect(formatDate(date)).toBe("29/7");
  });

  it("zero-pads day not month in Bun", () => {
    const date = new Date(2026, 0, 5);
    expect(formatDate(date)).toBe("5/1");
  });
});

describe("formatDayName", () => {
  it("returns short Spanish day name", () => {
    const date = new Date(2026, 6, 29);
    expect(formatDayName(date)).toBe("mié");
  });

  it("returns correct day for Monday", () => {
    const date = new Date(2026, 6, 27);
    expect(formatDayName(date)).toBe("lun");
  });
});

describe("formatTemperature", () => {
  it("formats temperature with unit", () => {
    expect(formatTemperature(25, "°C")).toBe("25°C");
    expect(formatTemperature(-5, "°F")).toBe("-5°F");
  });
});
