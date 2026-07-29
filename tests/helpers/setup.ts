import { mock } from "bun:test";
import { mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

type JsonResponse = unknown;

export function mockFetch(response: JsonResponse, ok = true): void {
  globalThis.fetch = mock(async () =>
    new Response(JSON.stringify(response), { status: ok ? 200 : 500 })
  ) as unknown as typeof globalThis.fetch;
}

export function mockFetchError(): void {
  globalThis.fetch = mock(async () =>
    new Response(null, { status: 500 })
  ) as unknown as typeof globalThis.fetch;
}

export function mockFetchImplementation(impl: (url: string) => Promise<Response>): void {
  globalThis.fetch = impl as unknown as typeof globalThis.fetch;
}

export function askSequence(answers: string[]) {
  let i = 0;
  return mock(async () => answers[i++] ?? "");
}

export function withTempHome(): { tmpHome: string; cleanup: () => void } {
  const tmpHome = mkdtempSync(join(tmpdir(), "weather-test-"));
  const originalHome = process.env.HOME;
  process.env.HOME = tmpHome;
  return {
    tmpHome,
    cleanup: () => {
      rmSync(tmpHome, { recursive: true, force: true });
      process.env.HOME = originalHome;
    },
  };
}
