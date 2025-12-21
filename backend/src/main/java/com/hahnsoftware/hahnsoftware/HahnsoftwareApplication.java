package com.hahnsoftware.hahnsoftware;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication
public class HahnsoftwareApplication {

	public static void main(String[] args) {
		SpringApplication.run(HahnsoftwareApplication.class, args);
	}

}
