# AGENTS.md

Weather CLI.

## Runtime: Bun, not Node

Use `bun` for everything — no `node`, `npm`, `pnpm`, `yarn`, `dotenv`, or `ts-node`.

- Run: `bun run src/index.ts`
- Install: `bun install`
- Add package: `bun add <pkg>`
- Execute: `bunx <pkg>`

Bun auto-loads `.env` — no dotenv loader needed.

## TypeScript quirks (tsconfig.json)

- `noEmit: true` → typecheck with `bunx tsc --noEmit`
- `verbatimModuleSyntax: true` → type-only imports must use `import type`
- `allowImportingTsExtensions: true` → imports must include `.ts` extension
- `types: ["bun"]` → Bun globals available; do **not** add `@types/node`
- Strict mode + `noUncheckedIndexedAccess` + `noImplicitOverride`

## Tests

Tests are in `tests/` using `bun:test`. Run with:

```bash
bun test
```

Coverage: utils (constants, colors, format), api (geocoding, weather), storage (settings, cities), actions (addCity, removeCity, setDefaultCity, toggleUnit).

### Mocking patterns

- **API tests**: override `globalThis.fetch` via `mockFetch()` helper.
- **Storage tests**: isolate filesystem by setting `process.env.HOME` to a temp dir (`withTempHome()` helper).
- **Action tests**: use `mock.module()` at top level with mutable variables (`let askResponses: string[]`, `let searchResult`) that the mock factory closes over; each test sets the variables before calling the SUT. The SUT is imported once via `await import()` after all `mock.module` calls.

## Build gating

`bun run build` runs `bun test && bun build --compile src/index.ts --outfile weather`. If any test fails, the binary is **not** compiled. Do not use `bun build` directly.

## Planned features (per README)

Interactive CLI (Spanish UI). Two-step OpenMeteo API, no API key:

1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`

Goals: default city, saved cities list, add/remove city, unit settings (°C), standalone binary via `bun build --compile`.

## References

- `bun-instructions.md` — wider Bun reference (frontend/DB sections don't apply here)
