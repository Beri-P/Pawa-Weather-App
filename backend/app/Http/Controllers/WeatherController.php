<?php

namespace App\Http\Controllers;

use App\Services\WeatherService;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    protected $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    /**
     * Get weather data for a city.
     */

     public function getWeatherByCity(Request $request)
     {
        $city = $request->query('city');

        if(!$city) {
            return response()->json(['error' => 'City is required'], 400);
        }

        //Get coordinates from city name
        $coordinates = $this->weatherService->getCoordinates($city);

        if(empty($coordinates)){
            return response()->json(['error' => 'City not found'], 404);
        }
        $lat = $coordinates[0]['lat'];
        $lon = $coordinates[0]['lon'];
        $city = $coordinates[0]['city'];
        $country = coordinates[0]['country'];

        // Get current weather
        $currentWeather = $this->weatherService->getCurrentWeather($lat, $lon);

        //Get forecast for next 3 days
        $forecast = $this->weatherService->getForecast($lat, $lon);

        //Combine data
        $data = [
            'location' => [
                'city' => $cityName,
                'country' => $country,
                'lat' => $lat,
                'lon' => $lon,
            ],
            'current' => $currentWeather,
            'forecast' => $forecast
        ];

        return response()->json($data);
     }
}