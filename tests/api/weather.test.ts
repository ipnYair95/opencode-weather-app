import { describe, it, expect, beforeEach } from "bun:test";
import { getWeather, getWeeklyForecast } from "../../src/api/weather.ts";
import { mockFetch, mockFetchError } from "../helpers/setup.ts";

const city = { name: "Ottawa", latitude: 45.41117, longitude: -75.69812 };

describe("getWeather", () => {
  beforeEach(() => {
    mockFetch({
      current: { temperature_2m: 22.5 },
      current_units: { temperature_2m: "°C" },
    });
  });

  it("returns weather data on success", async () => {
    const result = await getWeather(city, "C");
    expect(result).not.toBeNull();
    expect(result!.temperature).toBe(22.5);
    expect(result!.unit).toBe("°C");
  });

  it("returns null on HTTP error", async () => {
    mockFetchError();
    const result = await getWeather(city, "C");
    expect(result).toBeNull();
  });

  it("returns null when current data is missing", async () => {
    mockFetch({});
    const result = await getWeather(city, "C");
    expect(result).toBeNull();
  });
});

describe("getWeeklyForecast", () => {
  const forecastResponse = {
    daily: {
      time: ["2026-07-29", "2026-07-30"],
      temperature_2m_max: [25.0, 27.0],
      temperature_2m_min: [15.0, 17.0],
      weather_code: [0, 3],
    },
    daily_units: { temperature_2m_max: "°C" },
  };

  beforeEach(() => {
    mockFetch(forecastResponse);
  });

  it("returns forecast for 7 days", async () => {
    const result = await getWeeklyForecast(city, "C");
    expect(result).not.toBeNull();
    expect(result).toHaveLength(2);
    expect(result![0]!.tempMax).toBe(25.0);
    expect(result![0]!.tempMin).toBe(15.0);
    expect(result![0]!.weatherCode).toBe(0);
    expect(result![1]!.tempMax).toBe(27.0);
  });

  it("returns null on HTTP error", async () => {
    mockFetchError();
    const result = await getWeeklyForecast(city, "C");
    expect(result).toBeNull();
  });

  it("returns null when daily data is missing", async () => {
    mockFetch({});
    const result = await getWeeklyForecast(city, "C");
    expect(result).toBeNull();
  });
});
