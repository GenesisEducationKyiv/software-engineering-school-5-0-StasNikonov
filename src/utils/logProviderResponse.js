const fs = require('fs');
const path = require('path');

function logProviderResponse(provider, responseData) {
  const logMessage = `${provider} - Response: ${JSON.stringify(responseData)}\n`;
  const logFilePath = path.join(__dirname, '..', 'logs', 'provider.log');

  fs.mkdir(path.dirname(logFilePath), { recursive: true }, (err) => {
    if (err) return console.error('Failed to create log directory:', err);

    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) console.error('Failed to write log:', err);
    });
  });
}

module.exports = logProviderResponse;
