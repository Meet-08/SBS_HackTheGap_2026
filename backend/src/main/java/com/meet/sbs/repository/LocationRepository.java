package com.meet.sbs.repository;

import com.meet.sbs.models.Location;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    boolean existsByStateAndDistrict(String state, String district);

    Optional<Location> findByStateAndDistrict(@NotBlank(message = "State cannot be empty") String state, @NotBlank(message = "District cannot be empty") String district);
}
