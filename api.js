import { WEATHER_API_KEY } from '@env';

console.log(WEATHER_API_KEY);

export const getWeather = async (city) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
  );
  const data = await response.json();
  return data;
};