package com.hahnsoftware.hahnsoftware.controllers;

import com.hahnsoftware.hahnsoftware.controllers.dto.CreateTaskRequest;
import com.hahnsoftware.hahnsoftware.models.Task;
import com.hahnsoftware.hahnsoftware.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/project/{projectId}")
    public ResponseEntity<Task> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        Task createdTask = taskService.createTask(
                projectId,
                request.title(),
                request.description(),
                request.dueDate(),
                userEmail
        );

        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }
}

