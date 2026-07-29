import { describe, it, expect } from "bun:test";
import { weatherDescription } from "../../src/utils/constants.ts";

describe("weatherDescription", () => {
  it('returns "Despejado" for code 0', () => {
    expect(weatherDescription(0)).toBe("☀️ Despejado");
  });

  it('returns "Parcialmente nublado" for codes 1-2', () => {
    expect(weatherDescription(1)).toBe("⛅ Parcialmente nublado");
    expect(weatherDescription(2)).toBe("⛅ Parcialmente nublado");
  });

  it('returns "Nublado" for code 3', () => {
    expect(weatherDescription(3)).toBe("☁️ Nublado");
  });

  it('returns "Niebla" for codes 45 and 48', () => {
    expect(weatherDescription(45)).toBe("🌫️ Niebla");
    expect(weatherDescription(48)).toBe("🌫️ Niebla");
  });

  it('returns "Llovizna" for codes 51-57', () => {
    expect(weatherDescription(51)).toBe("🌦️ Llovizna");
    expect(weatherDescription(55)).toBe("🌦️ Llovizna");
    expect(weatherDescription(57)).toBe("🌦️ Llovizna");
  });

  it('returns "Lluvia" for codes 61-67', () => {
    expect(weatherDescription(61)).toBe("🌧️ Lluvia");
    expect(weatherDescription(65)).toBe("🌧️ Lluvia");
    expect(weatherDescription(67)).toBe("🌧️ Lluvia");
  });

  it('returns "Nieve" for codes 71-77', () => {
    expect(weatherDescription(71)).toBe("❄️ Nieve");
    expect(weatherDescription(75)).toBe("❄️ Nieve");
    expect(weatherDescription(77)).toBe("❄️ Nieve");
  });

  it('returns "Chubascos" for codes 80-82', () => {
    expect(weatherDescription(80)).toBe("🌦️ Chubascos");
    expect(weatherDescription(82)).toBe("🌦️ Chubascos");
  });

  it('returns "Nevadas" for codes 85-86', () => {
    expect(weatherDescription(85)).toBe("🌨️ Nevadas");
    expect(weatherDescription(86)).toBe("🌨️ Nevadas");
  });

  it('returns "Tormenta" for codes >= 95', () => {
    expect(weatherDescription(95)).toBe("⛈️ Tormenta");
    expect(weatherDescription(99)).toBe("⛈️ Tormenta");
  });

  it('returns "Desconocido" for unhandled codes', () => {
    expect(weatherDescription(90)).toBe("❓ Desconocido");
    expect(weatherDescription(4)).toBe("❓ Desconocido");
  });
});
