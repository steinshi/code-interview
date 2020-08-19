function checkScore(minScore, providerScore) {
  return providerScore >= minScore;
}

function checkSpecialty(specialty, providerSpecialty) {
  return providerSpecialty.indexOf(specialty.toLowerCase()) !== -1;
}

function checkDate(formattedDate, providerDates) {
  return providerDates.some(({ from, to }) => {
    return (
      new Date(from).toISOString() <= formattedDate &&
      formattedDate <= new Date(to).toISOString()
    );
  });
}

module.exports = {
  checkScore,
  checkSpecialty,
  checkDate
};
