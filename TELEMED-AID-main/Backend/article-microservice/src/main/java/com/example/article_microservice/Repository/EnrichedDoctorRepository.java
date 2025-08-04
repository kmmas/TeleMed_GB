package com.example.article_microservice.Repository;

import com.example.article_microservice.Model.EnrichedDoctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrichedDoctorRepository extends JpaRepository<EnrichedDoctor, Long> {
}