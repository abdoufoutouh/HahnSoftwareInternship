package com.hahnsoftware.hahnsoftware.controllers;

import com.hahnsoftware.hahnsoftware.controllers.dto.CreateTaskRequest;
import com.hahnsoftware.hahnsoftware.controllers.dto.TaskResponse;
import com.hahnsoftware.hahnsoftware.controllers.dto.UpdateTaskRequest;
import com.hahnsoftware.hahnsoftware.models.Task;
import com.hahnsoftware.hahnsoftware.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/project/{projectId}")
    public ResponseEntity<TaskResponse> createTask(
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

        return new ResponseEntity<>(TaskResponse.from(createdTask), HttpStatus.CREATED);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskResponse>> getTasksByProject(
            @PathVariable Long projectId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        List<Task> tasks = taskService.getTasksByProject(projectId, userEmail);
        List<TaskResponse> responses = tasks.stream()
                .map(TaskResponse::from)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/{taskId}/toggle")
    public ResponseEntity<TaskResponse> toggleTask(
            @PathVariable Long taskId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        Task updatedTask = taskService.toggleTask(taskId, userEmail);
        return ResponseEntity.ok(TaskResponse.from(updatedTask));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        Task updatedTask = taskService.updateTask(
                taskId,
                request.title(),
                request.description(),
                request.dueDate(),
                userEmail
        );

        return ResponseEntity.ok(TaskResponse.from(updatedTask));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        taskService.deleteTask(taskId, userEmail);
        return ResponseEntity.noContent().build();
    }
}

