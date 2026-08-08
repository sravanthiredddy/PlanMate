package com.tasktracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; // ✅ ADD THIS

@SpringBootApplication
@EnableScheduling // ✅ ENABLE SCHEDULER
public class TaskTrackerBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskTrackerBackendApplication.class, args);
	}
}