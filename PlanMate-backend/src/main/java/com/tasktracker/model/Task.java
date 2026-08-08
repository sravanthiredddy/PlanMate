package com.tasktracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is mandatory")
    private String title;

    @NotBlank(message = "Description is mandatory")
    private String description;

    private String status;
    private String category;
    private String priority;

    private LocalDate dueDate;
    private String tags;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private boolean completed = false;

    // 🔥 ADD THESE (IMPORTANT)
    @Column(nullable = false)
    private boolean reminder2DaySent = false;

    @Column(nullable = false)
    private boolean reminder1DaySent = false;

    @Column(nullable = false)
    private boolean reminderTodaySent = false;

    @Column(nullable = false)
    private boolean overdueSent = false;

    // Default constructor
    public Task() {}

    // Constructor
    public Task(String title, String description, String status, String category,
                String priority, LocalDate dueDate, String tags, User user, boolean completed) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.category = category;
        this.priority = priority;
        this.dueDate = dueDate;
        this.tags = tags;
        this.user = user;
        this.completed = completed;
    }

    // Getters & Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    // 🔥 NEW GETTERS/SETTERS

    public boolean isReminder2DaySent() { return reminder2DaySent; }
    public void setReminder2DaySent(boolean reminder2DaySent) { this.reminder2DaySent = reminder2DaySent; }

    public boolean isReminder1DaySent() { return reminder1DaySent; }
    public void setReminder1DaySent(boolean reminder1DaySent) { this.reminder1DaySent = reminder1DaySent; }

    public boolean isReminderTodaySent() { return reminderTodaySent; }
    public void setReminderTodaySent(boolean reminderTodaySent) { this.reminderTodaySent = reminderTodaySent; }

    public boolean isOverdueSent() { return overdueSent; }
    public void setOverdueSent(boolean overdueSent) { this.overdueSent = overdueSent; }
}