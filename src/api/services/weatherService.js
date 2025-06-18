const axios = require('axios');

const getWeather = async (city) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=uk`;

  try {
    const response = await axios.get(url);
    const weatherData = response.data;

    return {
      temperature: weatherData.current.temp_c,
      humidity: weatherData.current.humidity,
      description: weatherData.current.condition.text,
      city: weatherData.location.name,
    };
  } catch (error) {
    console.error('Error in getWeather', error);
    throw new Error('Error fetching weather data');
  }
};

module.exports = {
  getWeather,
};
