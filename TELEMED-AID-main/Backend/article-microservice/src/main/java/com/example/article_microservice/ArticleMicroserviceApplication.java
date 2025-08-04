package com.example.article_microservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;


@SpringBootApplication
@EnableDiscoveryClient
public class ArticleMicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArticleMicroserviceApplication.class, args);
	}

}
