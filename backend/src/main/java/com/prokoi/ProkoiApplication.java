package com.prokoi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ProkoiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProkoiApplication.class, args);
    }
}
