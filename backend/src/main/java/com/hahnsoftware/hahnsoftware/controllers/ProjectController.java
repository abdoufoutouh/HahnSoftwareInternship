package com.hahnsoftware.hahnsoftware.controllers;

import com.hahnsoftware.hahnsoftware.controllers.auth.dto.ProjectProgressResponse;
import com.hahnsoftware.hahnsoftware.controllers.dto.ProjectResponse;
import com.hahnsoftware.hahnsoftware.models.Project;
import com.hahnsoftware.hahnsoftware.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/create")
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody Project project,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        Project createdProject = projectService.createProject(
                project.getTitle(),
                project.getDescription(),
                userEmail
        );
        return new ResponseEntity<>(ProjectResponse.from(createdProject), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects(Authentication authentication) {
        String email = authentication.getName();
        List<Project> projects = projectService.getProjectsByUserEmail(email);
        List<ProjectResponse> responses = projects.stream()
                .map(ProjectResponse::from)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id,  Authentication authentication) {
        String email = authentication.getName();
        projectService.deleteProject(id, email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<ProjectProgressResponse> getProjectProgress(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String email = authentication.getName();
        ProjectProgressResponse response = projectService.getProjectProgress(id, email);
        return ResponseEntity.ok(response);
    }

}
