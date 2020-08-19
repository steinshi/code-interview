const ProvidersModel = require("../models/providersModel");
const providersRepo = require("../repository/providersRepo");

function getAppointments(req, res) {
  const providers = ProvidersModel.sortedProviders;
  const { specialty, date, minScore } = req.query;
  let formattedDate;

  if (!specialty || !date || !minScore) {
    return res.sendStatus(400);
  }

  try {
    formattedDate = new Date(parseInt(date)).toISOString();
  } catch (err) {
    return res.sendStatus(400);
  }

  const response = providers.reduce((providersArr, provider) => {
    if (
      providersRepo.checkScore(minScore, provider.score) &&
      providersRepo.checkSpecialty(specialty, provider.specialties) &&
      providersRepo.checkDate(formattedDate, provider.availableDates)
    ) {
      providersArr.push(provider.name);
    }
    return providersArr;
  }, []);

  res.send(response);
}

function setAppointments(req, res) {
  let providers = ProvidersModel.getProvidersMappedObject();
  const { name, date } = req.body;
  let formattedDate;

  try {
    formattedDate = new Date(parseInt(date)).toISOString();
  } catch (err) {
    return res.sendStatus(400);
  }

  const provider = providers[name.toLowerCase()];

  if (!provider) {
    return res.sendStatus(400);
  }

  const ifDateIsAvailable = providersRepo.checkDate(
    formattedDate,
    provider.availableDates
  );

  if (!ifDateIsAvailable) {
    return res.sendStatus(400);
  }

  res.sendStatus(200);
}

module.exports = {
  getAppointments,
  setAppointments
};
