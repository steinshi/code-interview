package vimserver.server.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vimserver.server.models.Appointment;
import vimserver.server.models.AvailableDate;
import vimserver.server.models.Provider;

import java.util.ArrayList;

@Service
public class ProvidersService {
    @Autowired
    DataService dataService;

    public ArrayList<String> checkForMatchingAppointment(String specialty, Long date, Double score){
        ArrayList<String> matchingProvidersNames = new ArrayList<>();
        ArrayList<Provider> matchingProviders = new ArrayList<Provider>();

        for (Provider currProvider : this.dataService.getProvidersMap().values()) {
            if (chechSpecificProvider(currProvider, specialty, date, score)) {
                matchingProviders.add(currProvider);
            }
        }

        matchingProviders.sort(Provider::compareTo);
        matchingProviders.forEach(provider -> matchingProvidersNames.add(provider.getName()));

        return matchingProvidersNames;
    }

    private boolean chechSpecificProvider(Provider provider, String specialty, Long date, Double score) {
        return checkSpecialty(provider, specialty) &&
               checkDates(provider, date) &&
               checkScore(provider, score);
    }

    private boolean checkSpecialty(Provider provider, String speciatly) {
        for (String currSpecialty: provider.getSpecialties()) {
            if (currSpecialty.toLowerCase().equals(speciatly.toLowerCase())) {
                return true;
            }
        }

        return false;
    }

    private boolean checkDates(Provider provider, Long date) {
       for (AvailableDate currDate: provider.getAvailableDates()) {
           if (currDate.getFrom() <= date && currDate.getTo() >= date)
               return true;
        }

       return false;
    }

    private boolean checkScore(Provider provider, double score) {
        return provider.getScore() >= score;
    }

    public boolean doesAvailibiltyExist(Appointment appointment) {
        Provider matchingProvider = this.dataService.getProvidersMap().get(appointment.getName());

        if (matchingProvider != null)
                return checkDates(matchingProvider, appointment.getDate());

        return false;
    }
}
