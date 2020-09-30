const providers = require('./providers.json');

function searchProviders(specialty, date, minScore) {
    if (!minScore){
        minScore = 0;
    }
    specialty = specialty.charAt(0).toUpperCase() + specialty.slice(1).toLowerCase();
    let rel_providers = providers.filter((provider=>{
            if (provider.score >= minScore &&
                provider.specialties.includes(specialty) &&
                checkDate(provider, date)) {
                return true;
            }
            return false;
        }));
    
    return rel_providers
    .sort((p_a,p_b)=>{
        return p_b.score - p_a.score;
    })
    .map((provider)=>{
        return provider.name;
    });
}

function checkDate(provider, date) {
    let available_times = provider.availableDates.filter((meeting_time)=>{
        //console.log(date, meeting_time.from , meeting_time.from >= date, meeting_time.to, meeting_time.to <= date);
        if (date >= meeting_time.from && date <= meeting_time.to) {
            return true;
        }
        return false;
    });
    if (available_times.length > 0) {
        return true;
    }
    return false;
}

function appointmentAvailable(name, date){
    providers.filter((provider=>{
            if (provider.name == name &&
                checkDate(provider, date)) {
                return true;
            }
            return false;
        }));
}

module.exports = {searchProviders, appointmentAvailable};
