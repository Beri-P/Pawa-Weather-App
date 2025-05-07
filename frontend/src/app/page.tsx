'use client';

import { useState, useEffect } from 'react';
import { WeatherData } from '../types';

export default function Home() {
  const [city, setCity] = useState<string>('Nairobi');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState<boolean>(true);

  // Fetch weather data
  const fetchWeatherData = async () => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/api/weather?city=${encodeURIComponent(city)}`);
      
      if (!response.ok) {
        throw new Error('City not found or API error');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Convert temperature between Celsius and Fahrenheit
  const convertTemperature = (temp: number): number => {
    return isCelsius ? temp : (temp * 9/5) + 32;
  };

  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format day name
  const formatDayName = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'long'
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData();
  };

  // Initial data fetch
  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <main className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-lightText">Pawa Weather App</h1>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            className="flex-grow input-primary placeholder-secondaryText"
            placeholder="Enter city name..."
          />
          <button type="submit" className="btn-primary ml-2">Search</button>
        </form>

        {/* Main Card */}
        {weatherData && (
          <div className="bg-darkElement rounded-2xl shadow-2xl p-6 space-y-6">

            {/* Unit Switch */}
            <div className="flex justify-end">
              <div className="inline-flex bg-dark rounded-lg p-1 gap-1">
                <button
                  className={`w-12 text-center py-1 rounded-lg ${isCelsius ? 'bg-primaryBlue text-white' : 'text-lightText'}`}
                  onClick={() => setIsCelsius(true)}
                >°C</button>
                <button
                  className={`w-12 text-center py-1 rounded-lg ${!isCelsius ? 'bg-primaryBlue text-white' : 'text-lightText'}`}
                  onClick={() => setIsCelsius(false)}
                >°F</button>
              </div>
            </div>

            {/* City & Date */}
            <div>
              <h2 className="text-3xl font-semibold text-lightText">
                {weatherData.location.city}, {weatherData.location.country}
              </h2>
              <p className="text-sm text-secondaryText">
                {formatDate(weatherData.current.dt)}
              </p>
            </div>

            {/* Current Weather */}
            <div className="flex items-center justify-between">
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@4x.png`}
                alt="icon"
                className="w-24 h-24"
              />
              <div className="text-right">
                <div className="text-8xl font-bold text-lightText">
                  {Math.round(convertTemperature(weatherData.current.main.temp))}°{isCelsius ? 'C' : 'F'}
                </div>
                <div className="text-lg text-secondaryText capitalize">
                  {weatherData.current.weather[0].description}
                </div>
              </div>
            </div>

            {/* 3-Day Forecast */}
            <div>
              <h3 className="text-2xl font-semibold text-lightText mb-4">3-Day Forecast</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {weatherData.forecast.map((day, i) => (
                  <div key={i} className="bg-darkElement rounded-2xl p-4 text-center space-y-2">
                    <p className="text-sm text-lightText">{formatDayName(day.dt)}</p>
                    <div className="bg-primaryBlue/10 inline-block p-2 rounded-full">
                      <img
                        src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                        alt="icon"
                        className="w-12 h-12"
                      />
                    </div>
                    <p className="text-2xl font-bold text-lightText">
                      {Math.round(convertTemperature(day.main.temp))}°{isCelsius ? 'C' : 'F'}
                    </p>
                    <p className="text-sm text-secondaryText capitalize">
                      {day.weather[0].description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Details Panel */}
            <div className="bg-darkElement rounded-2xl p-6 space-y-6">
              {/* Wind */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-dark p-2 rounded-full">
                    {/* SVG icon */}
                  </div>
                  <p className="text-base text-secondaryText">Wind Status</p>
                </div>
                <p className="text-lg font-medium text-lightText">
                  {weatherData.current.wind.speed} m/s
                </p>
              </div>
              {/* Humidity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-dark p-2 rounded-full">
                    {/* SVG icon */}
                  </div>
                  <p className="text-base text-secondaryText">Humidity</p>
                </div>
                <p className="text-lg font-medium text-lightText">
                  {weatherData.current.main.humidity}%
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}