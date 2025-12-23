package com.hahnsoftware.hahnsoftware.service;

import com.hahnsoftware.hahnsoftware.models.Project;

import java.util.List;

public interface ProjectService {

    Project createProject(String title , String description , String userEmail );

    List<Project> getProjectsByUserEmail(String email);

    void deleteProject(Long projectId, String userEmail);

}
