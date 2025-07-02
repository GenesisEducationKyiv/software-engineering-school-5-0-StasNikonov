const buildForecastEmail = ({
  city,
  temp_c,
  humidity,
  condition,
  unsubscribeLink,
}) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Прогноз погоди для міста ${city}</h2>
    <p><strong>Температура:</strong> ${temp_c}°C</p>
    <p><strong>Вологість:</strong> ${humidity}%</p>
    <p><strong>Умови:</strong> ${condition}</p>
    <hr />
    <p style="font-size: 12px; color: gray;">Це повідомлення надіслано автоматично відповідно до вашої підписки.</p>
    <p style="font-size: 0.9em;">
      Більше не хочете отримувати прогнози? 
      <a href="${unsubscribeLink}">Відписатись</a>
    </p>
  </div>
`;
module.exports = { buildForecastEmail };
