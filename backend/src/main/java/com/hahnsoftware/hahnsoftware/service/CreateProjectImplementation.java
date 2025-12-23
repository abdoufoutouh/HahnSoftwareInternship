package com.hahnsoftware.hahnsoftware.service;

import com.hahnsoftware.hahnsoftware.controllers.auth.dto.ProjectProgressResponse;
import com.hahnsoftware.hahnsoftware.exception.ResourceNotFoundException;
import com.hahnsoftware.hahnsoftware.exception.UnauthorizedActionException;
import com.hahnsoftware.hahnsoftware.models.Project;
import com.hahnsoftware.hahnsoftware.models.Task;
import com.hahnsoftware.hahnsoftware.models.User;
import com.hahnsoftware.hahnsoftware.repository.ProjectRepository;
import com.hahnsoftware.hahnsoftware.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreateProjectImplementation implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public CreateProjectImplementation(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Project createProject(String title, String description, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

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
        Project project = projectRepository.findByIdAndUser_Email(projectId, userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        projectRepository.delete(project);
    }

    @Override
    public ProjectProgressResponse getProjectProgress(Long projectId, String userEmail) {
        Project project = projectRepository
                .findByIdAndUser_Email(projectId, userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        int totalTasks = project.getTasks().size();
        int completedTasks = (int) project.getTasks()
                .stream()
                .filter(Task::isCompleted)
                .count();

        int progress = totalTasks == 0
                ? 0
                : (int) ((completedTasks * 100.0) / totalTasks);

        return new ProjectProgressResponse(
                project.getId(),
                totalTasks,
                completedTasks,
                progress
        );
    }
}
