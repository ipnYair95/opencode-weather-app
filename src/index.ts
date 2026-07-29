import { loadConfig } from "./storage/settingsStorage.ts";
import { startMenu } from "./presentation/menu.ts";

const config = await loadConfig();
await startMenu(config);
