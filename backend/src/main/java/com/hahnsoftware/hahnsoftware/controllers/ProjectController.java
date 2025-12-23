package com.hahnsoftware.hahnsoftware.controllers;

import com.hahnsoftware.hahnsoftware.models.Project;
import com.hahnsoftware.hahnsoftware.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/create")
    public ResponseEntity<Project> createProject(
            @RequestBody Project project,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        Project createdProject = projectService.createProject(
                project.getTitle(),
                project.getDescription(),
                userEmail
        );

        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }
}
