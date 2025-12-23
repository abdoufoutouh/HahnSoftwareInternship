package com.hahnsoftware.hahnsoftware.service;

import com.hahnsoftware.hahnsoftware.controllers.auth.dto.ProjectProgressResponse;
import com.hahnsoftware.hahnsoftware.models.Project;
import com.hahnsoftware.hahnsoftware.models.Task;

import java.util.List;

public interface ProjectService {

    Project createProject(String title , String description , String userEmail );

    List<Project> getProjectsByUserEmail(String email);

    void deleteProject(Long projectId, String userEmail);

    ProjectProgressResponse getProjectProgress(Long projectId, String userEmail);
}
