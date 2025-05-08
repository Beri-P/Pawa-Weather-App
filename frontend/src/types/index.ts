export interface WeatherData {
    location: {
      city: string;
      country: string;
      lat: number;
      lon: number;
    };
    current: {
      weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
      }[];
      main: {
        temp: number;
        humidity: number;
      };
      wind: {
        speed: number;
      };
      dt: number;
      name: string;
    };
    forecast: any[];
  }