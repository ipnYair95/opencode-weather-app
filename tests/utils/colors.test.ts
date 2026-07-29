import { describe, it, expect } from "bun:test";
import { cyan, yellow, green, red, reset, colorize } from "../../src/utils/colors.ts";

describe("colors", () => {
  it("has correct ANSI codes", () => {
    expect(cyan).toBe("\x1b[36m");
    expect(yellow).toBe("\x1b[33m");
    expect(green).toBe("\x1b[32m");
    expect(red).toBe("\x1b[31m");
    expect(reset).toBe("\x1b[0m");
  });

  it("colorize wraps text with color and reset", () => {
    const result = colorize("hello", cyan);
    expect(result).toBe("\x1b[36mhello\x1b[0m");
  });

  it("colorize works with empty string", () => {
    const result = colorize("", green);
    expect(result).toBe("\x1b[32m\x1b[0m");
  });
});
