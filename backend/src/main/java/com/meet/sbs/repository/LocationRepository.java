package com.meet.sbs.repository;

import com.meet.sbs.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    boolean existsByStateAndDistrict(String state, String district);
}
