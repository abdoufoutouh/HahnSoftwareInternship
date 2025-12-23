package com.hahnsoftware.hahnsoftware.controllers.dto;

import java.util.List;

public record ProjectResponse(
        Long id,
        String title,
        String description,
        List<TaskResponse> tasks
) {
    public static ProjectResponse from(com.hahnsoftware.hahnsoftware.models.Project project) {
        List<TaskResponse> tasks = project.getTasks() != null 
                ? project.getTasks().stream()
                    .map(TaskResponse::from)
                    .toList()
                : List.of();
        
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                tasks
        );
    }
}

