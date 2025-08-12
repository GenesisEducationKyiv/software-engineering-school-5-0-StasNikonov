function subscribe(subscriptionService) {
  return async (call, callback) => {
    try {
      const result = await subscriptionService.subscribe(call.request);
      callback(null, result);
    } catch (err) {
      console.error('Subscribe error:', err.message);
      callback({ code: 13, message: 'Internal server error' });
    }
  };
}

function confirm(subscriptionService) {
  return async (call, callback) => {
    try {
      const result = await subscriptionService.confirm(call.request);
      callback(null, result);
    } catch (err) {
      console.error('Confirm error:', err.message);
      callback({ code: 13, message: 'Internal server error' });
    }
  };
}

function unsubscribe(subscriptionService) {
  return async (call, callback) => {
    try {
      const result = await subscriptionService.unsubscribe(call.request);
      callback(null, result);
    } catch (err) {
      console.error('Unsubscribe error:', err.message);
      callback({ code: 13, message: 'Internal server error' });
    }
  };
}

function getConfirmedByFrequency(subscriptionService) {
  return async (call, callback) => {
    try {
      const frequency = call.request.frequency;
      const subscribers =
        await subscriptionService.getConfirmedByFrequency(frequency);
      callback(null, { subscribers });
    } catch (err) {
      console.error('GetConfirmedByFrequency error:', err.message);
      callback({ code: 13, message: 'Internal server error' });
    }
  };
}

module.exports = { subscribe, confirm, unsubscribe, getConfirmedByFrequency };
