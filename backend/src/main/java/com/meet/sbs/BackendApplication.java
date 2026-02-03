package com.meet.sbs;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        // Trigger CI - Attempt 2
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(DataLoader dataLoader) {
        return _ -> {
            dataLoader.loadCentroidData();
            dataLoader.addAdminUserIfNotExists();
        };
    }

}
