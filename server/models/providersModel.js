const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const config = require("../config");

const adapter = new FileSync(config.DB_PATH);
var providersDB = low(adapter);

// Get the providers according to the givven params
function getProviders(specialty, date, minScore) {
  return providersDB
    .get("providers")
    .filter(
      provider =>
        minScore <= provider.score &&
        provider.availableDates.find(
          providerAvailableDates =>
            providerAvailableDates.from <= date &&
            providerAvailableDates.to >= date
        ) &&
        provider.specialties.find(
          providerSpecialties =>
            providerSpecialties.toUpperCase() === specialty.toUpperCase()
        )
    )
    .sortBy("score")
    .value();
}

// get the provider details only if it exist and
// available in the given time
function getAvailableProviderByName(name, date) {
  return providersDB
    .get("providers")
    .filter(
      provider =>
        provider.name === name &&
        provider.availableDates.find(
          providerAvailableDates =>
            providerAvailableDates.from <= date &&
            providerAvailableDates.to >= date
        )
    )
    .value();
}

module.exports = { getProviders, getAvailableProviderByName };
