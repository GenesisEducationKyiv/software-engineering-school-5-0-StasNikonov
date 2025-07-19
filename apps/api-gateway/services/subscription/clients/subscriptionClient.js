const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../../../../proto/subscription.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const subscriptionProto =
  grpc.loadPackageDefinition(packageDefinition).subscription;

const subscriptionClient = new subscriptionProto.SubscriptionService(
  process.env.SUBSCRIPTION_SERVICE_ADDRESS || 'localhost:50052',
  grpc.credentials.createInsecure(),
);

module.exports = subscriptionClient;
