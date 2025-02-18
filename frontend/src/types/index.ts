export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Weather {
  temperature: number;
  description: string;
  icon: string;
}
