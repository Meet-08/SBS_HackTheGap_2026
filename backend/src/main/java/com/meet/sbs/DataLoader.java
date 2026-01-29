package com.meet.sbs;

import com.meet.sbs.enums.Role;
import com.meet.sbs.models.Location;
import com.meet.sbs.models.User;
import com.meet.sbs.repository.LocationRepository;
import com.meet.sbs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;


@Component
@RequiredArgsConstructor
public class DataLoader {

    private final Logger log = LoggerFactory.getLogger(DataLoader.class);
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void loadCentroidData() {
        try (var resource = getClass().getResourceAsStream("/centroid.csv")) {
            assert resource != null;

            if (locationRepository.count() != 0L)
                return;

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
        }
    }

    public void addAdminUserIfNotExists() {
        String adminEmail = "testadmin@gmail.com";
        if (userRepository.existsByEmail(adminEmail)) {
            log.debug("Admin user already exists: {}", adminEmail);
            return;
        }
        var adminUser = User.builder()
                .firstName("Test")
                .lastName("Admin")
                .password(passwordEncoder.encode("test@1234"))
                .email(adminEmail)
                .role(Role.ADMIN)
                .build();
        userRepository.save(adminUser);
        log.debug("Admin user created: {}", adminEmail);
    }
}
