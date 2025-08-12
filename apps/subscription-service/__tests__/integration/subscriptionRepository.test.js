const { Sequelize, DataTypes } = require('sequelize');
const { PostgreSqlContainer } = require('@testcontainers/postgresql');

const SubscriptionModelFactory = require('../../db/models/subscription');
const SubscriptionRepository = require('../../src/repositories/SubscriptionRepository');

describe('SubscriptionRepository integration test', () => {
  let container;
  let sequelize;
  let SubscriptionModel;
  let subscriptionRepository;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:14').start();

    sequelize = new Sequelize(container.getConnectionUri(), {
      logging: false,
    });

    SubscriptionModel = SubscriptionModelFactory(sequelize, DataTypes);

    await sequelize.sync({ force: true });

    subscriptionRepository = new SubscriptionRepository(SubscriptionModel);
  });

  afterAll(async () => {
    await sequelize.close();
    await container.stop();
  });

  test('create, find, confirm and delete subscription', async () => {
    const data = {
      email: 'test@example.com',
      city: 'Kyiv',
      frequency: 'daily',
      token: 'testToken',
    };

    //Create subscription
    const subscription = await subscriptionRepository.createSubscription(data);

    expect(subscription.email).toBe(data.email);
    expect(subscription.confirmed).toBe(false);

    //Find subscription
    const found = await subscriptionRepository.findSubscription(
      data.email,
      data.city,
    );

    expect(found.token).toBe(data.token);

    //Confirm subscription
    await subscriptionRepository.confirmSubscription(found);
    const confirmed = await subscriptionRepository.findByToken(data.token);

    expect(confirmed.confirmed).toBe(true);

    //Get confirmed subscriptions by frequency
    const confirmedSubs =
      await subscriptionRepository.getConfirmedByFrequency('daily');

    expect(confirmedSubs.length).toBe(1);
    expect(confirmedSubs[0].email).toBe(data.email);

    //Delete subscription
    await subscriptionRepository.deleteSubscription(confirmed);
    const afterDelete = await subscriptionRepository.findByToken(data.token);
    expect(afterDelete).toBeNull();
  });
});
