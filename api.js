import { WEATHER_API_KEY } from '@env';

console.log(WEATHER_API_KEY);

export const getWeather = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch weather data');
  }

  return data;
};

export const getAirQuality = async (lat, lon) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch air quality data');
  }
  return data.list[0].main.aqi;
}