export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es", { day: "2-digit", month: "2-digit" }).format(date);
}

export function formatDayName(date: Date): string {
  return new Intl.DateTimeFormat("es", { weekday: "short" }).format(date);
}

export function formatTemperature(temp: number, unit: string): string {
  return `${temp}${unit}`;
}
