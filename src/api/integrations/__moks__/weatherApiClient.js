module.exports = {
  fetchWeatherData: jest.fn().mockResolvedValue({
    location: { name: 'Kyiv' },
    current: {
      temp_c: 18,
      humidity: 55,
      condition: {
        text: 'Місцями дощ',
      },
    },
  }),
};
