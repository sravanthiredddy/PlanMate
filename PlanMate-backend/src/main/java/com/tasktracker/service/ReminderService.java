package com.tasktracker.service;

import com.tasktracker.model.Task;
import com.tasktracker.model.User;
import com.tasktracker.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private EmailService emailService;

    // ⏰ Runs daily at 9 AM
    @Scheduled(cron = "0 12 12 * * ?")
    public void sendDailyReminders() {

        List<Task> tasks = taskRepository.findAll();
        LocalDate today = LocalDate.now();

        for (Task task : tasks) {

            // ❌ skip if no due date
            if (task.getDueDate() == null) continue;

            // ❌ skip if already completed
            if (task.isCompleted()) continue;

            User user = task.getUser();
            if (user == null || user.getEmail() == null) continue;

            long daysLeft = ChronoUnit.DAYS.between(today, task.getDueDate());

            // ✅ ONLY 1 DAY BEFORE + ONLY ONCE
            if (daysLeft == 1 && !task.isReminder1DaySent()) {

                String email = user.getEmail();

                String subject = "⏰ Task Reminder";

                String body = "Hello " + user.getName() + ",\n\n" +
                        "⚠️ Reminder: Your task is due tomorrow.\n\n" +
                        "• Task: " + task.getTitle() + "\n" +
                        "• Due Date: " + task.getDueDate() + "\n\n" +
                        "Please complete it on time.\n\n" +
                        "You’ve got this 💪";

                // 📧 send email
                emailService.sendTaskEmail(email, subject, body);

                // ✅ mark as sent (VERY IMPORTANT)
                task.setReminder1DaySent(true);
                taskRepository.save(task);
            }
        }
    }
}