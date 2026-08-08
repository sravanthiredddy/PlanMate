package com.tasktracker.repository;

import com.tasktracker.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Get tasks by user ID
    List<Task> findByUserId(Long userId);

    // Get tasks by status for a specific user
    List<Task> findByUserIdAndStatus(Long userId, String status);

    // Get tasks by category for a specific user
    List<Task> findByUserIdAndCategory(Long userId, String category);
    
}