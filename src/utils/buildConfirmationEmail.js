const buildConfirmationEmail = (city, link) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
    <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="padding: 20px;">
        <h2 style="color: #333;">Підтвердження підписки</h2>
        <p style="font-size: 16px; color: #555;">Ви підписалися на щоденний прогноз погоди для міста <strong>${city}</strong>.</p>
        <p style="font-size: 16px; color: #555;">Щоб завершити підписку, натисніть на кнопку нижче:</p>
        <a href="${link}" style="display: inline-block; padding: 12px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 4px; font-size: 16px;">Підтвердити підписку</a>
        <p style="font-size: 14px; color: #999; margin-top: 20px;">Якщо ви не підписувалися, просто ігноруйте цей лист.</p>
      </div>
    </div>
  </div>
`;

module.exports = { buildConfirmationEmail };
