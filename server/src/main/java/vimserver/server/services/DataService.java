package vimserver.server.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import vimserver.server.models.Provider;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.HashMap;

@Service
public class DataService {
    private static final Logger logger = LoggerFactory.getLogger(DataService.class);
    private final String FILE_PATH = "C:\\devl\\Vim\\server\\src\\main\\resources\\providers.json";
    private HashMap<String, Provider> providersMap;

    @PostConstruct
    public void init() {
        this.providersMap = this.initJSONData();
    }

    private HashMap<String, Provider> initJSONData() {
        try {
            HashMap<String, Provider> providersHashMap = new HashMap<>();
            ObjectMapper mapper = new ObjectMapper();
            Provider[] providers = mapper.readValue(Paths.get(this.FILE_PATH).toFile(), Provider[].class);

            for (Provider currProvider: providers) {
                providersHashMap.put(currProvider.getName(), currProvider);
            }

            return providersHashMap;
        } catch (IOException exception) {
            logger.error("Unable to parse JSON file", exception);
            return null;
        }
    }

    public HashMap<String, Provider> getProvidersMap() {
        return providersMap;
    }
}
