import { cyan, colorize } from "../utils/colors.ts";
import { ask, closeReadline } from "./input.ts";
import { handleDefaultCity, handleAllCities, handleAllCitiesForecast } from "../actions/getWeather.ts";
import { handleAddCity } from "../actions/addCity.ts";
import { handleRemoveCity } from "../actions/removeCity.ts";
import { handleSetDefault } from "../actions/setDefaultCity.ts";
import { handleToggleUnit } from "../actions/toggleUnit.ts";
import type { Config } from "../types/City.ts";

function menuLine(): string {
  return colorize("  " + "═".repeat(38), cyan);
}

function printMenu(config: Config): void {
  const defaultLabel = config.defaultCity
    ? `Clima de ciudad default (${config.defaultCity.name})`
    : "Clima de ciudad default";
  const unitLabel = `Ajustes (°${config.unit})`;
  const cityCount = config.cities.length;

  console.log(`\n${menuLine()}`);
  console.log(colorize("  " + " ".repeat(12) + "WEATHER CLI", cyan));
  console.log(`${menuLine()}`);
  console.log(colorize(`   1. ${defaultLabel}`, cyan));
  console.log(colorize(`   2. Clima de todas las ciudades (${cityCount})`, cyan));
  console.log(colorize(`   3. Buscar y agregar ciudad`, cyan));
  console.log(colorize(`   4. Eliminar ciudad`, cyan));
  console.log(colorize(`   5. Establecer ciudad default`, cyan));
  console.log(colorize(`   6. Pronóstico 7 días de todas las ciudades`, cyan));
  console.log(colorize(`   8. ${unitLabel}`, cyan));
  console.log(colorize(`   9. Salir`, cyan));
  console.log(`${menuLine()}`);
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
      case "6":
        await handleAllCitiesForecast(config);
        break;
      case "8":
        await handleToggleUnit(config);
        break;
      case "9":
        closeReadline();
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
