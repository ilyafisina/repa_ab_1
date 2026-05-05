package com.mathtutor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.mathtutor")
public class MathTutorApplication {

    public static void main(String[] args) {
        SpringApplication.run(MathTutorApplication.class, args);
    }
}
