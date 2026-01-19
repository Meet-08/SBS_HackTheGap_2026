package com.meet.sbs.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "prediction_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship to User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String crop;

    @Column(name = "predicted_yield_qha")
    private Double predictedYieldQha;

    @Column(name = "model_used")
    private String modelUsed;

    @Column(name = "prediction_date")
    @Builder.Default
    private LocalDateTime predictionDate = LocalDateTime.now();

    @Embedded
    private WeatherInfo weather;

    @Embedded
    private SoilInfo soil;
}
