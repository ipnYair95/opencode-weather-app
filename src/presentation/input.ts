import * as readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const iter = rl[Symbol.asyncIterator]();

export async function ask(query: string): Promise<string> {
  process.stdout.write(query);
  const { value } = await iter.next();
  return value ?? "";
}

export function closeReadline(): void {
  rl.close();
}
