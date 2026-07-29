import { cyan, yellow, red, reset, colorize } from "../utils/colors.ts";

export function printSeparator(): void {
  console.log(colorize("  " + "═".repeat(38), cyan));
}

export function printError(message: string): void {
  console.log(`\n  ${red}✗${reset} ${message}`);
}

export function printSuccess(message: string): void {
  console.log(`  ✓ ${message}`);
}

export function printInfo(message: string): void {
  console.log(`\n  ${message}`);
}
