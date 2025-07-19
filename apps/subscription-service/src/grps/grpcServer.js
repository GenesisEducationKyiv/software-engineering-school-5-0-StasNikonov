const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const {
  subscribe,
  confirm,
  unsubscribe,
  getConfirmedByFrequency,
} = require('./handlers');

const PROTO_PATH = path.join(__dirname, '../../../proto/subscription.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const subscriptionProto =
  grpc.loadPackageDefinition(packageDefinition).subscription;

function startGRPCServer(subscriptionService) {
  const server = new grpc.Server();

  server.addService(subscriptionProto.SubscriptionService.service, {
    Subscribe: subscribe(subscriptionService),
    Confirm: confirm(subscriptionService),
    Unsubscribe: unsubscribe(subscriptionService),
    GetConfirmedByFrequency: getConfirmedByFrequency(subscriptionService),
  });

  server.bindAsync(
    '0.0.0.0:50052',
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log('SubscriptionService running on port 50052');
    },
  );
}

module.exports = startGRPCServer;
