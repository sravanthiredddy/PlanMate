package com.tasktracker.controller;

import com.tasktracker.model.Task;
import com.tasktracker.model.User;
import com.tasktracker.repository.TaskRepository;
import com.tasktracker.repository.UserRepository;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin("*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ CREATE TASK (NO EMAIL HERE)
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createTask(@PathVariable Long userId,
                                        @Valid @RequestBody Task task) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

            task.setUser(user);
            Task savedTask = taskRepository.save(task);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Task created successfully", "task", savedTask));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to create task", "error", e.getMessage()));
        }
    }

    // ✅ GET ALL TASKS
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAllTasksForUser(@PathVariable Long userId) {
        try {
            List<Task> tasks = taskRepository.findByUserId(userId);
            return ResponseEntity.ok(tasks);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to fetch tasks", "error", e.getMessage()));
        }
    }

    // ✅ GET SINGLE TASK
    @GetMapping("/user/{userId}/task/{taskId}")
    public ResponseEntity<?> getTaskById(@PathVariable Long userId,
                                         @PathVariable Long taskId) {
        try {
            Task task = taskRepository.findById(taskId)
                    .filter(t -> t.getUser().getId().equals(userId))
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            return ResponseEntity.ok(task);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ✅ UPDATE TASK
    @PutMapping("/user/{userId}/task/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Long userId,
                                        @PathVariable Long taskId,
                                        @Valid @RequestBody Task updatedTask) {
        try {
            Task task = taskRepository.findById(taskId)
                    .filter(t -> t.getUser().getId().equals(userId))
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setStatus(updatedTask.getStatus());
            task.setCategory(updatedTask.getCategory());
            task.setPriority(updatedTask.getPriority());
            task.setDueDate(updatedTask.getDueDate());
            task.setTags(updatedTask.getTags());

            Task savedTask = taskRepository.save(task);

            return ResponseEntity.ok(Map.of("message", "Task updated successfully", "task", savedTask));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to update task", "error", e.getMessage()));
        }
    }

    // ✅ DELETE TASK
    @DeleteMapping("/user/{userId}/task/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long userId,
                                        @PathVariable Long taskId) {
        try {
            Task task = taskRepository.findById(taskId)
                    .filter(t -> t.getUser().getId().equals(userId))
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            taskRepository.delete(task);

            return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Failed to delete task", "error", e.getMessage()));
        }
    }

    // ✅ FILTER BY STATUS
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<?> getTasksByStatus(@PathVariable Long userId,
                                              @PathVariable String status) {
        try {
            List<Task> tasks = taskRepository.findByUserIdAndStatus(userId, status);
            return ResponseEntity.ok(tasks);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Error fetching tasks", "error", e.getMessage()));
        }
    }

    // ✅ FILTER BY CATEGORY
    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<?> getTasksByCategory(@PathVariable Long userId,
                                                @PathVariable String category) {
        try {
            List<Task> tasks = taskRepository.findByUserIdAndCategory(userId, category);
            return ResponseEntity.ok(tasks);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Error fetching tasks", "error", e.getMessage()));
        }
    }
}