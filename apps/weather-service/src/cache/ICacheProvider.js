class ICacheProvider {
  async get(_key) {
    throw new Error('Method not implemented');
  }

  async set(_key, _value, _ttl) {
    throw new Error('Method not implemented');
  }
}

module.exports = ICacheProvider;
