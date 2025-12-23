package com.hahnsoftware.hahnsoftware.service;

import com.hahnsoftware.hahnsoftware.models.Project;
import com.hahnsoftware.hahnsoftware.models.User;
import com.hahnsoftware.hahnsoftware.repository.ProjectRepository;
import com.hahnsoftware.hahnsoftware.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreateProjectImplementation implements ProjectService {

    private  final  ProjectRepository projectRepository;
    private  final UserRepository userRepository;

    public CreateProjectImplementation(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Project createProject(String title, String description, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = new Project();
        project.setTitle(title);
        project.setDescription(description);
        project.setUser(user);

        return projectRepository.save(project);

    }

    @Override
    public List<Project> getProjectsByUserEmail(String email) {
        return projectRepository.findAllByUser_Email(email);
    }

    @Override
    public void deleteProject(Long projectId, String userEmail) {
        Project project = projectRepository.findById(projectId).
                orElseThrow(() -> new RuntimeException("Project not found"));

        projectRepository.delete(project);

    }
}
