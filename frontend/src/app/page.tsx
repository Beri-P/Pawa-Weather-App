
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
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-6xl">
        {/* App Title */}
        <h1 className="text-5xl font-bold text-black text-center my-10">Pawa Weather App</h1>

        {loading && <div className="text-center text-gray-700 text-xl py-4">Loading...</div>}
        {error && <div className="text-center text-error text-gray-800 py-4">{error}</div>}

        {weatherData && !loading && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Current Day Forecast */}
            <div className="w-full md:w-1/3 card bg-white shadow-lg rounded-xl border border-gray-200 h-full">
              <div className="card-body p-8">
                <div className="text-center">
                  <h2 className="text-3xl text-black font-semibold">
                    {weatherData.location.city}, {weatherData.location.country}
                  </h2>
                  <p className="text-lg text-gray-500 mt-2">
                    {formatDate(weatherData.current.dt)}
                  </p>
                </div>
                
                <div className="flex flex-col items-center justify-center mt-10">
                  <img 
                    src={`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}
                    alt={weatherData.current.weather[0].description}
                    className="w-32 h-32"
                  />
                  <div className="text-center mt-4">
                    <div className="text-7xl font-bold text-gray-500">
                      {Math.round(convertTemperature(weatherData.current.main.temp))}°
                      {isCelsius ? 'C' : 'F'}
                    </div>
                    <div className="text-2xl text-gray-600 capitalize mt-4">
                      {weatherData.current.weather[0].description}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contains 3 Sections */}
            <div className="w-full md:w-2/3 flex flex-col gap-8">
              {/* Top Section - Search and Temperature Toggle */}
              <div className="card bg-blue-50 shadow-lg rounded-xl border border-blue-100">
                <div className="card-body flex flex-col sm:flex-row items-center justify-between p-6">
                  <form onSubmit={handleSubmit} className="flex w-full sm:w-auto mb-4 sm:mb-0">
                    <input
                      type="text"
                      className="input input-primary rounded-lg px-4 py-3 w-full sm:w-64 text-lg text-gray-600"
                      placeholder="Enter city name..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary ml-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg">
                      Search
                    </button>
                  </form>
                  
                  <div className="btn-group rounded-lg overflow-hidden">
                    <button 
                      className={`btn px-6 py-3 text-lg ${isCelsius ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}
                      onClick={() => setIsCelsius(true)}
                    >
                      °C
                    </button>
                    <button 
                      className={`btn px-6 py-3 text-lg ${!isCelsius ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}
                      onClick={() => setIsCelsius(false)}
                    >
                      °F
                    </button>
                  </div>
                </div>
              </div>

              {/* Middle Section - 3-Day Forecast */}
              <div className="card bg-indigo-50 shadow-lg rounded-xl border border-indigo-100">
                <div className="card-body p-6">
                  <h3 className="text-2xl font-semibold mb-6 text-blue-950">3-Day Forecast</h3>
                  <div className="grid grid-cols-3 gap-6">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="card bg-white shadow rounded-lg border border-gray-200">
                        <div className="card-body p-5 text-center">
                          <h4 className="font-medium text-lg text-gray-800">
                            {formatDate(day.dt).split(',')[0]}
                          </h4>
                          <img 
                            src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                            alt={day.weather[0].description}
                            className="w-16 h-16 mx-auto my-2"
                          />
                          <p className="text-xl font-bold text-gray-500">
                            {Math.round(convertTemperature(day.main.temp))}°
                            {isCelsius ? 'C' : 'F'}
                          </p>
                          <p className="text-sm capitalize mt-2">
                            {day.weather[0].description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section - Wind Status and Humidity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Wind Status Card */}
                <div className="card bg-emerald-50 shadow-lg rounded-xl border border-emerald-100">
                  <div className="card-body p-6">
                    <h4 className="text-xl text-emerald-700 font-medium mb-4">Wind Status</h4>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500 mr-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-3xl font-bold text-gray-700">
                          {weatherData.current.wind.speed} m/s
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Humidity Card */}
                <div className="card bg-amber-50 shadow-lg rounded-xl border border-amber-100">
                  <div className="card-body p-6">
                    <h4 className="text-xl text-amber-700 font-medium mb-4">Humidity</h4>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500 mr-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" />
                      </svg>
                      <div>
                        <p className="text-3xl font-bold text-gray-700">
                          {weatherData.current.main.humidity}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}