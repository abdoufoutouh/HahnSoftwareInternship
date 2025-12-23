package com.hahnsoftware.hahnsoftware.controllers.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateTaskRequest(
        @NotBlank(message = "Task title is required")
        String title,
        
        String description,
        
        @NotNull(message = "Due date is required")
        LocalDate dueDate
) {}

