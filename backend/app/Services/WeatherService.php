<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WeatherService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.openweathermap.org/data/2.5/';
    protected $geoUrl = 'http://api.openweathermap.org/geo/1.0/';

    public function __construct()
    {
        $this->apiKey = env('OPENWEATHER_API_KEY', '51ebdcb2a404a4572fb5874241f2038a');
    }

    /**
     * Get coordinates for a city name using Geocoding API.
     */
    public function getCoordinates($city)
    {
        $response = Http::get($this->geoUrl . 'direct', [
            'q' => $city,
            'limit' => 1,
            'appid' => $this->apiKey
        ]);

        return $response->json();
    }

    /**
     * Get the current weather data for coordinates.
     */

    public function getCurrentWeather($lat, $lon)
    {
        $response = Http::get($this->baseUrl . 'weather', [
            'lat' => $lat,
            'lon' => $lon,
            'appid' => $this->apiKey,
            'units' => 'metric'
        ]);

        return $response->json();
    }

    /**
     * Get forecast data for coordinates (5 day / 3 hour forecast).
     */

    public function getForecast($lat, $lon)
    {
        $response = Http::get($this->baseUrl . 'forecast', [
            'lat' => $lat,
            'lon' => $lon,
            'appid' => $this->apiKey,
            'units' => 'metric'
        ]);

        // Process the forecast to get daily forecasts
        $forecast = $response->json();
        $dailyForecasts = $this->processForecastData($forecast);

        return $dailyForecasts;
    }

    /**
     * Process forecast data to get one forecast per day.
     */

    private function processForecastData($forecast)
    {
        $dailyForecasts = [];
        $processedDays = [];

        if (isset($forecast['list']) && is_array($forecast['list'])) {
            foreach ($forecast['list'] as $item) {
                $date = date('Y-m-d', $item['dt']);

                //Skip if we already have this day's forecast
                if (in_array($date, $processedDays)) {
                    continue;
                }

                // Skip today as we have current weather for that
                if ($date === date('Y-m-d')) {
                    continue;
                }

                $processedDays[] = $date;
                $dailyForecasts[] = $item;

                //We only need 3 days
                if (count($dailyForecasts) >= 3) {
                    break;
                }
            }
        }
        return $dailyForecasts;
    }
}
