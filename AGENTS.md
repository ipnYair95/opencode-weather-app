# AGENTS.md

Weather CLI (planned). Current state: `bun init` scaffold (`index.ts` prints "Hello via Bun!").

## Runtime: Bun, not Node

Use `bun` for everything — no `node`, `npm`, `pnpm`, `yarn`, `dotenv`, or `ts-node`.

- Run: `bun run index.ts`
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

## Planned features (per README)

Interactive CLI (Spanish UI). Two-step OpenMeteo API, no API key:

1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`

Goals: default city, saved cities list, add/remove city, unit settings (°C), standalone binary via `bun build --compile`.

## References

- `bun-instructions.md` — wider Bun reference (frontend/DB sections don't apply here)
