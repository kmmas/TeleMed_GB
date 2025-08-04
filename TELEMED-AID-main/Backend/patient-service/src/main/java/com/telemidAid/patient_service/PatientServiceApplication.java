package com.telemidAid.patient_service;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.nio.file.Paths;

@SpringBootApplication
@EnableDiscoveryClient
public class PatientServiceApplication {

	public static void main(String[] args) {
//		String rootDir = Paths.get("").toAbsolutePath().toString();
//		String moduleDir = rootDir;
//
//		Dotenv dotenv = Dotenv.configure()
//				.directory(moduleDir)
//				.filename(".env")
//				.load();
//
//		// Set system properties from .env
//
//		dotenv.entries().forEach(entry ->
//				System.setProperty(entry.getKey(), entry.getValue())
//		);
		SpringApplication.run(PatientServiceApplication.class, args);
	}

}
