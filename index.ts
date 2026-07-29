import { loadConfig } from "./src/storage.ts";
import { startMenu } from "./src/menu.ts";

const config = await loadConfig();
await startMenu(config);
