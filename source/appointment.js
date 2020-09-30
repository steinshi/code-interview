const providers = require('./providers_search.js');

function setAppointment(name, date) {
    if (providers.appointmentAvailable(name, date)) {
        return true;
    }
    return false;
}


module.exports = {setAppointment};
