package com.meet.sbs;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.meet.sbs.models.Location;
import com.meet.sbs.repository.LocationRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/data")
@RequiredArgsConstructor
public class DataLoader {

    private final Logger log = LoggerFactory.getLogger(DataLoader.class);
    private final LocationRepository locationRepository;

    @GetMapping("/load-centroid")
    public String loadCentroidData() {
        try (var resource = getClass().getResourceAsStream("/centroid.csv")) {
            List<Location> locations = new BufferedReader(new InputStreamReader(resource))
                    .lines()
                    .skip(1)
                    .map(line -> {
                        String[] parts = line.split(",");
                        Location location = new Location();
                        location.setState(parts[0]);
                        location.setDistrict(parts[1]);
                        location.setLatitude(Double.parseDouble(parts[2]));
                        location.setLongitude(Double.parseDouble(parts[3]));
                        return location;
                    }).toList();

            locations.forEach(l -> {
                if (locationRepository.existsByStateAndDistrict(l.getState(), l.getDistrict())) {
                    log.debug("Location already exists: {} - {}", l.getState(), l.getDistrict());
                    return;
                }

                log.debug("Loaded location: {} - {}, Lat: {}, Lon: {}",
                        l.getState(), l.getDistrict(), l.getLatitude(), l.getLongitude());
                locationRepository.save(l);
            });
        } catch (Exception e) {
            log.error("Error loading centroid data", e);
            return "Failed to load centroid data";
        }
        return "Centroid data loaded";
    }

}
