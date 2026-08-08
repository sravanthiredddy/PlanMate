package com.tasktracker.controller;

import com.tasktracker.model.Task;
import com.tasktracker.repository.TaskRepository;
import com.tasktracker.service.AIService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AIController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private AIService aiService;

    // ✅ MEMORY
    private final Map<Long, String> userIntent = new HashMap<>();
    private final Map<Long, List<Task>> lastSuggestions = new HashMap<>();

    @PostMapping("/user/{userId}")
    public String getAIResponse(@PathVariable Long userId,
                               @RequestBody Map<String, String> body) {

        String msg = body.get("message");
        if (msg == null || msg.trim().isEmpty()) {
            return "Please type something 😊";
        }

        String lower = msg.toLowerCase().trim();
        List<Task> tasks = taskRepository.findByUserId(userId);

        // ================= GREETING =================
        if (lower.matches("hi|hello|hey")) {
            return "Hello 😊\nHow can I help you with your tasks today?";
        }

        // ================= SHOW TASKS =================
        if (lower.contains("task")) {

            if (tasks.isEmpty()) return "You have no tasks.";

            StringBuilder res = new StringBuilder("Here are your tasks:\n\n");

            for (Task t : tasks) {
                res.append("• ")
                        .append(t.getTitle())
                        .append(" (")
                        .append(t.getPriority())
                        .append(")\n");
            }

            userIntent.put(userId, "AFTER_TASKS");

            res.append("\n👉 What would you like to do next?\n")
               .append("• Get suggestion\n")
               .append("• Create a plan\n")
               .append("• Check deadlines");

            return res.toString();
        }

        // ================= CASUAL RESPONSES =================
        if (contains(lower, "ok", "okay", "done", "i will try", "i'll try", "sure")) {
            return "Great 😊\n\nStart with the first task.\nI'm here if you need help again 👍";
        }

        if (lower.equals("no")) {
            return "That's okay 😊\n\nTake a short break.\nThen try starting with a small task 💡";
        }

        if (contains(lower, "what happen", "what happened")) {
            return "No problem 😊\n\nI'm here to help you manage your tasks better.\nTell me what you need 👍";
        }

        // ================= HANDLE YES =================
        if (lower.equals("yes")) {

            String intent = userIntent.get(userId);

            if ("AFTER_SUGGESTION".equals(intent)) {
                userIntent.put(userId, "PLAN_WAIT_TIME");
                return "Great 👍\nTell me your free time\n(Example: 6 PM - 9 PM)";
            }

            if ("AFTER_TASKS".equals(intent)) {
                return "Do you want:\n• suggestion\n• plan\n• deadlines ?";
            }
        }

        // ================= SUGGEST TASK =================
        if (contains(lower, "which", "suggest", "suggestion", "what should i do")) {

            if (tasks.isEmpty()) return "No tasks available.";

            List<Task> sorted = rankTasks(new ArrayList<>(tasks));
            List<Task> top = sorted.subList(0, Math.min(2, sorted.size()));

            lastSuggestions.put(userId, top);
            userIntent.put(userId, "AFTER_SUGGESTION");

            StringBuilder res = new StringBuilder("I suggest you start like this:\n\n");

            for (int i = 0; i < top.size(); i++) {
                res.append("• ").append(i + 1).append(". ")
                        .append(top.get(i).getTitle()).append("\n");
            }

            res.append("\n💡 Why this order:\n");

            for (Task t : top) {
                res.append("• ").append(t.getTitle())
                        .append(" → ").append(reason(t)).append("\n");
            }

            res.append("\n👉 If you want, I can create a plan for you.");

            return res.toString();
        }

        // ================= PLAN START =================
        if (contains(lower, "plan", "create")) {

            if (tasks.isEmpty()) return "No tasks to plan.";

            List<Task> sorted = rankTasks(new ArrayList<>(tasks));
            lastSuggestions.put(userId, sorted);

            userIntent.put(userId, "PLAN_WAIT_TIME");

            return "Sure 👍\nTell me your free time\n(Example: 6 PM - 9 PM)";
        }

        // ================= PLAN CONTINUE =================
        if ("PLAN_WAIT_TIME".equals(userIntent.get(userId))) {

            userIntent.remove(userId);

            List<Task> sorted = lastSuggestions.getOrDefault(userId, rankTasks(tasks));

            int[] range = extractTime(msg);
            int start = range[0];
            int end = range[1];

            if (end <= start) {
                return "Please give valid time 😊 (Example: 6 PM - 9 PM)";
            }

            StringBuilder plan = new StringBuilder("Here’s your plan:\n\n");

            int cur = start;

            for (Task t : sorted) {
                if (cur >= end) break;

                plan.append("• ")
                        .append(format(cur))
                        .append(" - ")
                        .append(format(cur + 1))
                        .append(" → ")
                        .append(t.getTitle())
                        .append("\n");

                cur++;
            }

            plan.append("\n💡 Why this plan:\n");

            for (Task t : sorted) {
                plan.append("• ")
                        .append(t.getTitle())
                        .append(" → ")
                        .append(reason(t))
                        .append("\n");
            }

            return plan.toString();
        }

        // ================= DEADLINES =================
        if (contains(lower, "deadline", "days")) {

            if (tasks.isEmpty()) return "No tasks.";

            StringBuilder res = new StringBuilder("Deadlines:\n\n");
            LocalDate today = LocalDate.now();

            for (Task t : tasks) {
                res.append("• ").append(t.getTitle()).append(" – ");

                if (t.getDueDate() == null) {
                    res.append("No deadline\n");
                } else {
                    long d = ChronoUnit.DAYS.between(today, t.getDueDate());

                    if (d < 0) res.append("Overdue ❌\n");
                    else if (d == 0) res.append("Today ⚠️\n");
                    else res.append(d).append(" days left\n");
                }
            }

            return res.toString();
        }

        // ================= WHY =================
        if (lower.equals("why")) {

            List<Task> last = lastSuggestions.get(userId);

            if (last == null) return "Ask me for suggestion first 😊";

            StringBuilder res = new StringBuilder("Here’s why:\n\n");

            for (Task t : last) {
                res.append("• ").append(t.getTitle())
                        .append(" → ").append(reason(t)).append("\n");
            }

            return res.toString();
        }

        // ================= MOTIVATION =================
        if (contains(lower, "motivate", "dont want", "tired", "lazy")) {
            return "Start small 💡\nJust 10 minutes.\nYou can do it 💪";
        }

        // ================= STRICT FILTER =================
        if (!contains(lower,
                "task","plan","deadline","suggest","motivate","why",
                "ok","done","try","no","help","what")) {

            return "I can help only with your tasks 😊";
        }

        // ================= FALLBACK =================
        return aiService.askAIWithTasks(userId, msg, convert(tasks));
    }

    // ================= HELPERS =================

    private List<Task> rankTasks(List<Task> tasks) {
        tasks.sort((a, b) -> Integer.compare(score(b), score(a)));
        return tasks;
    }

    private int score(Task t) {
        int s = 0;

        if (t.getDueDate() != null) {
            long d = ChronoUnit.DAYS.between(LocalDate.now(), t.getDueDate());
            if (d < 0) s += 100;
            else if (d == 0) s += 90;
            else if (d <= 2) s += 70;
        }

        if ("high".equalsIgnoreCase(t.getPriority())) s += 30;
        if ("medium".equalsIgnoreCase(t.getPriority())) s += 20;

        return s;
    }

    private String reason(Task t) {
        if (t.getDueDate() != null) {
            long d = ChronoUnit.DAYS.between(LocalDate.now(), t.getDueDate());
            if (d < 0) return "it is overdue";
            if (d == 0) return "it is due today";
            if (d <= 2) return "it has a near deadline";
        }

        if ("high".equalsIgnoreCase(t.getPriority())) return "it has high priority";

        return "it should be completed soon";
    }

    private boolean contains(String text, String... words) {
        for (String w : words) if (text.contains(w)) return true;
        return false;
    }

    private int[] extractTime(String input) {
        try {
            input = input.toLowerCase().replaceAll(" ", "");
            String[] p = input.split("-");
            return new int[]{parse(p[0]), parse(p[1])};
        } catch (Exception e) {
            return new int[]{18, 21};
        }
    }

    private int parse(String t) {
        int h = Integer.parseInt(t.replaceAll("[^0-9]", ""));
        if (t.contains("pm") && h != 12) h += 12;
        if (t.contains("am") && h == 12) h = 0;
        return h;
    }

    private String format(int h) {
        if (h == 0) return "12 AM";
        if (h < 12) return h + " AM";
        if (h == 12) return "12 PM";
        return (h - 12) + " PM";
    }

    private List<Map<String, Object>> convert(List<Task> tasks) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Task t : tasks) {
            Map<String, Object> m = new HashMap<>();
            m.put("title", t.getTitle());
            m.put("priority", t.getPriority());
            m.put("dueDate", t.getDueDate());
            list.add(m);
        }
        return list;
    }
}