package vimserver.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vimserver.server.models.Appointment;
import vimserver.server.services.ProvidersService;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.ArrayList;

@RestController
@Validated
public class ServerController {
    private static final Logger logger = LoggerFactory.getLogger(ServerController.class);

    @Autowired
    private ProvidersService providersService;

    @GetMapping(value="/appointments", produces= MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ArrayList<String>> get
            (@RequestParam(name="specialty", required=true, defaultValue="") String specialty,
             @RequestParam(name="date", required=true, defaultValue="") Long date,
             @RequestParam(name="minScore", required=true, defaultValue="") @Min(0) @Max(10) Double minScore) {
        ArrayList<String> availableProviders = providersService.checkForMatchingAppointment(specialty, date, minScore);

        if (specialty.equals("")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } else {
            return ResponseEntity.ok().body(availableProviders);
        }
    }

    @PostMapping(value = "/appointments", consumes = "application/json")
    public ResponseEntity<String> post(@RequestBody Appointment appointment) {
        if (!this.providersService.doesAvailibiltyExist(appointment)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } else {
            return ResponseEntity.ok().build();
        }
    }
}
