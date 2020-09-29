const providersModel = require("../models/providersModel");

function getAppointment(specialty, date, minScore) {
  // TODO: chek parameters validation
  // check that minscore is number
  // check that specialty is text, doesnt matter the case
  if (!specialty) {
    return { code: 400, providers: [] };
  }
  // check that date is valid
  var validDate = new Date(parseInt(date)).getTime() > 0;
  if (!validDate) {
    return { code: 400, providers: [] };
  }

  // all valid - performe the query
  // return the providers names order by score
  let providers = providersModel
    .getProviders(specialty, date, minScore)
    .reverse();
  providers = Array.from(providers, provider => provider.name);

  return { code: 200, providers: providers };
}

function setAppointment(name, date) {
  let provider = providersModel.getAvailableProviderByName(name, date);
  // Check if such provider exist
  if (provider.length < 1 || provider == undefined) {
    return 400;
  }

  // TODO: Schedual meeting -
  // not sure if I should have change
  // the provider available dates in the DB_PATH
  // or just return the status code
  return 200;
}

module.exports = { getAppointment, setAppointment };
