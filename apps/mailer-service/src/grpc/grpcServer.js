const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { sendConfirmationEmail } = require('./handlers');

const PROTO_PATH = path.join(__dirname, '../../../proto/mailer.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH);
const mailerProto = grpc.loadPackageDefinition(packageDef).mailer;

function startGRPCServer(emailAdapter) {
  const server = new grpc.Server();

  server.addService(mailerProto.MailerService.service, {
    SendConfirmationEmail: sendConfirmationEmail(emailAdapter),
  });

  server.bindAsync(
    '0.0.0.0:50053',
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log('MailerService is running on port 50053');
    },
  );
}

module.exports = startGRPCServer;
