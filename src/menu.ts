import * as readline from "node:readline";
import type { City, Config } from "./types.ts";
import { searchCity, getWeather } from "./api.ts";
import { saveConfig } from "./storage.ts";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const iter = rl[Symbol.asyncIterator]();

async function ask(query: string): Promise<string> {
  process.stdout.write(query);
  const { value } = await iter.next();
  return value ?? "";
}

function menuLine(): string {
  return "  " + "═".repeat(38);
}

function printMenu(config: Config): void {
  const defaultLabel = config.defaultCity
    ? `Clima de ciudad default (${config.defaultCity.name})`
    : "Clima de ciudad default";
  const unitLabel = `Ajustes (°${config.unit})`;
  const cityCount = config.cities.length;

  console.log(`\n${menuLine()}`);
  console.log("  " + " ".repeat(12) + "WEATHER CLI");
  console.log(`${menuLine()}`);
  console.log(`   1. ${defaultLabel}`);
  console.log(`   2. Clima de todas las ciudades (${cityCount})`);
  console.log(`   3. Buscar y agregar ciudad`);
  console.log(`   4. Eliminar ciudad`);
  console.log(`   5. Establecer ciudad default`);
  console.log(`   8. ${unitLabel}`);
  console.log(`   9. Salir`);
  console.log(`${menuLine()}`);
}

async function showWeather(city: City, unit: "C" | "F"): Promise<void> {
  const weather = await getWeather(city, unit);
  if (weather === null) {
    console.log(`\n  ✗ Error al obtener el clima de ${city.name}`);
  } else {
    console.log(`\n  📍 ${city.name}: ${weather.temperature}${weather.unit}`);
  }
}

async function handleDefaultCity(config: Config): Promise<void> {
  if (!config.defaultCity) {
    console.log("\n  No hay ciudad default configurada.");
    return;
  }
  await showWeather(config.defaultCity, config.unit);
}

async function handleAllCities(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n  No hay ciudades guardadas.");
    return;
  }
  for (const city of config.cities) {
    await showWeather(city, config.unit);
  }
}

async function handleAddCity(config: Config): Promise<void> {
  const name = await ask("\n  Nombre de la ciudad: ");
  if (!name.trim()) {
    console.log("\n  Nombre inválido.");
    return;
  }

  console.log("  Buscando...");
  const result = await searchCity(name.trim());
  if (result === null) {
    console.log("\n  No se encontró ninguna ciudad con ese nombre.");
    return;
  }

  const locationLabel = result.country
    ? `${result.name}, ${result.country}`
    : result.name;
  console.log(`\n  → Se encontró: ${locationLabel}`);

  const answer = await ask("  ¿Agregar a la lista? (s/n): ");
  if (answer.toLowerCase() !== "s") {
    console.log("  Ciudad no agregada.");
    return;
  }

  const city: City = {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
  };

  config.cities.push(city);
  await saveConfig(config);
  console.log(`  ✓ ${result.name} agregada.`);

  if (!config.defaultCity) {
    const setDefault = await ask("  ¿Establecer como ciudad default? (s/n): ");
    if (setDefault.toLowerCase() === "s") {
      config.defaultCity = city;
      await saveConfig(config);
      console.log(`  ✓ Ciudad default actualizada: ${city.name}`);
    }
  }
}

async function handleRemoveCity(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n  No hay ciudades guardadas.");
    return;
  }

  console.log("\n  Ciudades guardadas:");
  for (let i = 0; i < config.cities.length; i++) {
    const city = config.cities[i]!;
    console.log(`  ${i + 1}. ${city.name}`);
  }

  const input = await ask("  Número a eliminar: ");
  const index = parseInt(input, 10) - 1;
  if (isNaN(index) || index < 0 || index >= config.cities.length) {
    console.log("\n  Número inválido.");
    return;
  }

  const removed = config.cities[index]!;
  config.cities.splice(index, 1);

  if (config.defaultCity && config.defaultCity.name === removed.name) {
    config.defaultCity = null;
  }

  await saveConfig(config);
  console.log(`  ✓ ${removed.name} eliminada.`);
}

async function handleSetDefault(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n  No hay ciudades guardadas. Agrega una primero.");
    return;
  }

  console.log("\n  Ciudades guardadas:");
  for (let i = 0; i < config.cities.length; i++) {
    const city = config.cities[i]!;
    console.log(`  ${i + 1}. ${city.name}`);
  }

  const input = await ask("  Número a establecer como default: ");
  const index = parseInt(input, 10) - 1;
  if (isNaN(index) || index < 0 || index >= config.cities.length) {
    console.log("\n  Número inválido.");
    return;
  }

  config.defaultCity = config.cities[index]!;
  await saveConfig(config);
  console.log(`  ✓ Ciudad default actualizada: ${config.defaultCity.name}`);
}

async function handleToggleUnit(config: Config): Promise<void> {
  config.unit = config.unit === "C" ? "F" : "C";
  await saveConfig(config);
  console.log(`\n  Unidad cambiada a °${config.unit}`);
}

export async function startMenu(config: Config): Promise<void> {
  while (true) {
    console.clear();
    printMenu(config);

    const option = await ask("  Selecciona una opción: ");

    switch (option) {
      case "1":
        await handleDefaultCity(config);
        break;
      case "2":
        await handleAllCities(config);
        break;
      case "3":
        await handleAddCity(config);
        break;
      case "4":
        await handleRemoveCity(config);
        break;
      case "5":
        await handleSetDefault(config);
        break;
      case "8":
        await handleToggleUnit(config);
        break;
      case "9":
        rl.close();
        console.log("¡Hasta luego!");
        process.exit(0);
      default:
        console.log("\n  Opción inválida, intenta de nuevo.");
    }

    if (option !== "9") {
      await ask("\n  Presiona Enter para continuar...");
    }
  }
}
