import { describe, it, expect, beforeEach } from "bun:test";
import { searchCity } from "../../src/api/geocoding.ts";
import { mockFetch, mockFetchError } from "../helpers/setup.ts";

describe("searchCity", () => {
  beforeEach(() => {
    mockFetch({
      results: [
        {
          name: "Ottawa",
          latitude: 45.41117,
          longitude: -75.69812,
          country: "Canadá",
        },
      ],
    });
  });

  it("returns city data on successful response", async () => {
    const result = await searchCity("Ottawa");
    expect(result).not.toBeNull();
    expect(result!.name).toBe("Ottawa");
    expect(result!.latitude).toBe(45.41117);
    expect(result!.longitude).toBe(-75.69812);
    expect(result!.country).toBe("Canadá");
  });

  it("returns null when results array is empty", async () => {
    mockFetch({ results: [] });
    const result = await searchCity("Nowhere");
    expect(result).toBeNull();
  });

  it("returns null when results field is missing", async () => {
    mockFetch({});
    const result = await searchCity("Unknown");
    expect(result).toBeNull();
  });

  it("returns null on HTTP error", async () => {
    mockFetchError();
    const result = await searchCity("Error");
    expect(result).toBeNull();
  });
});
