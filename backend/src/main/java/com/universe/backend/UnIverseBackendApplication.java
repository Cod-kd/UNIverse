package com.universe.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.universe.backend")
@EnableJpaRepositories(basePackages = "com.universe.backend.repositories")
@EntityScan(basePackages = "com.universe.backend.modules")
@ComponentScan(basePackages = {"com.universe.backend", "com.universe.backend.utils", "com.universe.backend.config"})
public class UnIverseBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(UnIverseBackendApplication.class, args);
	}
}
