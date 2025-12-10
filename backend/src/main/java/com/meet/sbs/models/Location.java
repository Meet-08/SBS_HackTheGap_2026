package com.meet.sbs.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(
        name = "locations",
        uniqueConstraints = @UniqueConstraint(columnNames = {"state", "district"})
)
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String district;

    private Double latitude;
    private Double longitude;
}

