# Pawa Weather App

A web application for fetching and displaying current weather and a 3-day forecast for any city. Built with a React/Next.js frontend and a PHP/Laravel backend that proxies OpenWeatherMap.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
   1. [Prerequisites](#prerequisites)
   2. [Installation](#installation)
   3. [Environment Variables](#environment-variables)
   4. [Running the App](#running-the-app)
4. [Screenshots](#screenshots)
5. [Project Structure](#project-structure)
6. [Contributing](#contributing)
7. [License](#license)
8. [Contact](#contact)

---

## Features

- **City Search**: Enter any city name to fetch weather.
- **Current Conditions**: Displays temperature, description, wind speed, humidity.
- **3-Day Forecast**: Shows daily high/low, icon and description.
- **Unit Toggle**: Switch between Celsius and Fahrenheit on the fly.
- **Responsive UI**: Built with Tailwind CSS and RippleUI.

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React, TypeScript, Tailwind CSS, RippleUI
- **Backend**: PHP, Laravel 10, Guzzle HTTP client
- **API**: OpenWeatherMap
- **Dev Tools**: Composer, npm, ESLint, Prettier

## Getting Started

### Prerequisites

- PHP 8.1+ & Composer
- Node.js v16+ & npm (or yarn)
- An [OpenWeatherMap API key](https://openweathermap.org/api)
- Git

### Installation

1. **Clone the repo**

   ```
   git clone https://github.com/Beri-P/Pawa-Weather-App.git
   cd Pawa-Weather-App
   ```

2. **Backend setup**

```
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

3. **Edit backend/.env with your credentials:**

```
OPENWEATHERMAP_API_KEY=your_api_key_here
```

4. **Frontend setup**

```
cd ../frontend
npm install
```

### Environment Varriables

- **OPENWEATHERMAP_API_KEY** – your OpenWeatherMap API key

- **APP_URL** – base URL of your Laravel backend (e.g. http://localhost:8000)

- **NEXT_PUBLIC_API_URL** – URL of your backend API endpoint (e.g. http://localhost:8000/api)

### Running the App

**Start the backend**

```
cd backend
php artisan serve --port=8000
```

- Backend listens on http://localhost:8000.

**Start the frontend**

```
cd ../frontend
npm run dev
```

- Frontend runs on http://localhost:3000 by default.

**Open**

Visit http://localhost:3000 in your browser and search for a city.

4. **Screenshots**

- All UI screenshots are in the Pawa Screenshots/ folder.

5. **Project Structure**

```
Pawa-Weather-App/
├── backend/                   # Laravel API proxy
│   ├── app/
│   ├── routes/
│   ├── .env.example
│   ├── composer.json
│   └── artisan
├── frontend/                  # Next.js 13 App Router
│   ├── app/
│   ├── components/
│   ├── styles/
│   └── package.json
├── screenshots/               # UI screenshots
└── LICENSE
```

6. **Contributing**

- Fork this repository

- Create a branch: git checkout -b feature/YourFeature

- Commit your changes: git commit -m "feat: add awesome feature"

- Push to your branch: git push origin feature/YourFeature

- Open a Pull Request

7. **License**

This project is licensed under the MIT License.

8. **Contact**

👤 Izuberi Beri
✉️ izuberi844@gmail.com

Feel free to tweak any section headings, ports, or folder names to match your exact setup!
