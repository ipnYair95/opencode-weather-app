export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

export interface Config {
  defaultCity: City | null;
  cities: City[];
  unit: "C" | "F";
}
