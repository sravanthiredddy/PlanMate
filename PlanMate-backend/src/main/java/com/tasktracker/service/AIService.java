package com.tasktracker.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class AIService {

    private static final String API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String API_KEY = "API_KEY";

    private final RestTemplate restTemplate = new RestTemplate();

    private Map<Long, List<Map<String, String>>> chatHistory = new HashMap<>();

    public String askAIWithTasks(Long userId, String userMessage, List<Map<String, Object>> tasks) {

        try {

            // ✅ Prepare task context
            StringBuilder taskDetails = new StringBuilder();

            for (Map<String, Object> t : tasks) {
                taskDetails.append("• ")
                        .append(t.get("title"))
                        .append(" (").append(t.get("priority"))
                        .append(", Due: ")
                        .append(t.get("dueDate") != null ? t.get("dueDate") : "No deadline")
                        .append(")\n");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(API_KEY);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama-3.1-8b-instant");

            List<Map<String, String>> messages = new ArrayList<>();

            // ✅ STRONG SYSTEM PROMPT
            Map<String, String> system = new HashMap<>();
            system.put("role", "system");
            system.put("content",
                    "You are a personal task assistant.\n" +
                    "You MUST only use the tasks provided.\n" +
                    "Do NOT create or assume tasks.\n" +
                    "Do NOT include tasks not listed.\n" +
                    "Always answer based ONLY on given tasks.\n" +
                    "Use bullet points.\n" +
                    "Be short and clear."
            );

            messages.add(system);

            // ✅ Task context
            Map<String, String> context = new HashMap<>();
            context.put("role", "system");
            context.put("content", "User Tasks:\n" + taskDetails);
            messages.add(context);

            // ✅ Memory
            List<Map<String, String>> history = chatHistory.get(userId);
            if (history == null) {
                history = new ArrayList<>();
            }

            messages.addAll(history);

            // ✅ User message
            Map<String, String> user = new HashMap<>();
            user.put("role", "user");
            user.put("content", userMessage);
            messages.add(user);

            body.put("messages", messages);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(API_URL, request, Map.class);

            Map res = response.getBody();

            List choices = (List) res.get("choices");
            Map choice = (Map) choices.get(0);
            Map msg = (Map) choice.get("message");

            String reply = msg.get("content").toString();

            // ✅ Save history
            history.add(user);

            Map<String, String> aiMsg = new HashMap<>();
            aiMsg.put("role", "assistant");
            aiMsg.put("content", reply);

            history.add(aiMsg);

            // Keep last 10 messages
            if (history.size() > 10) {
                history = history.subList(history.size() - 10, history.size());
            }

            chatHistory.put(userId, history);

            return reply;

        } catch (Exception e) {
            e.printStackTrace();
            return "Error calling AI";
        }
    }
}