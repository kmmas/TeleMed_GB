package com.example.article_microservice.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrichedDoctor {
    @Id
    private Long id;

    private String name;
    private String careerLevel;
    private String specializationName;
}
