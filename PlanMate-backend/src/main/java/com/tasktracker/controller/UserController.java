package com.tasktracker.controller;

import java.util.*;

import com.tasktracker.model.User;
import com.tasktracker.repository.UserRepository;
import com.tasktracker.service.EmailService; // ✅ EMAIL SERVICE

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService; // ✅ ADD THIS

    // ✅ REGISTER USER + SEND EMAIL
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        try {

            // 🔴 Check username
            if (userRepository.existsByUsername(user.getUsername())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Username already exists"));
            }

            // 🔴 Check email
            if (userRepository.existsByEmail(user.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Email already registered"));
            }

            // 🔐 Encode password
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // 💾 Save user
            User savedUser = userRepository.save(user);

            // 📧 SEND EMAIL
            String email = savedUser.getEmail();

            String subject = "Welcome to PlanMate 🎉";

            String body = "Hello " + savedUser.getName() + ",\n\n"
                    + "Welcome to PlanMate!\n\n"
                    + "Your account has been successfully created.\n\n"
                    + "You can now:\n"
                    + "• Create tasks\n"
                    + "• Get AI suggestions\n"
                    + "• Receive reminders\n\n"
                    + "Stay productive 🚀";

            // ✅ Send only if email exists
            if (email != null && !email.isEmpty()) {
                emailService.sendTaskEmail(email, subject, body);
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "User registered successfully"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Registration failed", "error", e.getMessage()));
        }
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.ok(Map.of(
                        "message", "Login successful",
                        "user", user
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid email or password"));
    }

    // ✅ FORGOT PASSWORD (Basic)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.ok(Map.of("message", "Reset feature available (email can be integrated)"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "No account found with that email"));
        }
    }

    // ✅ RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Password reset successful"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }
    }

    // ✅ GET ALL USERS
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ GET USER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found")));
    }

    // ✅ UPDATE USER
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @Valid @RequestBody User updatedUser) {

        return userRepository.findById(id)
                .map(user -> {

                    user.setName(updatedUser.getName());
                    user.setEmail(updatedUser.getEmail());
                    user.setUsername(updatedUser.getUsername());

                    if (updatedUser.getPassword() != null &&
                            !updatedUser.getPassword().isBlank()) {

                        user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                    }

                    userRepository.save(user);

                    return ResponseEntity.ok(Map.of("message", "User updated successfully"));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found")));
    }

    // ✅ DELETE USER
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }
    }
}