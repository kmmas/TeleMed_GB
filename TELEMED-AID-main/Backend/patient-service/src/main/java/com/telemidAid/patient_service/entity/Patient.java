package com.telemidAid.patient_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;


@Entity
@Table(name = "patient")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {
    @Id
    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "country_name", nullable = false, length = 100)
    private String countryName;

    @Column(name = "country_id", nullable = false, length = 20)
    private String countryId;

    @Column(nullable = false)
    private String phone;

    @Column(name = "date_of_birth", nullable = false)
    private Date birthDate;

    @Column(length = 10)
    public String gender;
}
