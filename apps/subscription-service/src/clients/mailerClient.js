const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.join(__dirname, '../../../proto/mailer.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const mailerProto = grpc.loadPackageDefinition(packageDefinition).mailer;

const client = new mailerProto.MailerService(
  process.env.MAILER_SERVICE_ADDRESS || 'localhost:50053',
  grpc.credentials.createInsecure(),
);

module.exports = client;
