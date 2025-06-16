const getWeather = async (city, fetchWeatherData) => {
  const weatherData = await fetchWeatherData(city);

  return {
    temperature: weatherData.current.temp_c,
    humidity: weatherData.current.humidity,
    description: weatherData.current.condition.text,
    city: weatherData.location.name,
  };
};

module.exports = {
  getWeather,
};
