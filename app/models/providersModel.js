const providers = require("../../providers/providers.json");

class ProvidersModel {
  static providersObject = providers.reduce((providersObj, provider) => {
    providersObj[provider.name.toLowerCase()] = provider;
    return providersObj;
  }, {});

  static sortedProviders = providers
    .sort((providerA, providerB) => providerB.score - providerA.score)
    .map(provider => {
      provider.specialties = provider.specialties.map(s => s.toLowerCase());
      return provider;
    });

  static getProviders() {
    return ProvidersModel.sortedProviders;
  }

  static getProvidersMappedObject() {
    return ProvidersModel.providersObject;
  }
}

module.exports = ProvidersModel;
