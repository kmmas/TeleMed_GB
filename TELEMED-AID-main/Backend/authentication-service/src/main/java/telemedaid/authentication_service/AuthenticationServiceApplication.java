package telemedaid.authentication_service;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

import java.nio.file.Paths;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class AuthenticationServiceApplication {

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
		SpringApplication.run(AuthenticationServiceApplication.class, args);
	}

}
