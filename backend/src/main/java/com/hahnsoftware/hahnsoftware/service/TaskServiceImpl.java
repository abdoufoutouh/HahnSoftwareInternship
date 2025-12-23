package com.hahnsoftware.hahnsoftware.service;

import com.hahnsoftware.hahnsoftware.models.Project;
import com.hahnsoftware.hahnsoftware.models.Task;
import com.hahnsoftware.hahnsoftware.repository.ProjectRepository;
import com.hahnsoftware.hahnsoftware.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskServiceImpl(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public Task createTask(Long projectId, String title, String description, LocalDate dueDate, String userEmail) {
        // Fetch project and verify ownership
        Project project = projectRepository.findByIdAndUser_Email(projectId, userEmail)
                .orElseThrow(() -> new RuntimeException("Project not found or unauthorized access"));

        // Create task
        Task task = Task.builder()
                .title(title)
                .description(description)
                .dueDate(dueDate)
                .completed(false)
                .project(project)
                .build();

        // Save and return
        return taskRepository.save(task);
    }
}

