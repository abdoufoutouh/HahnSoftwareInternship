package com.hahnsoftware.hahnsoftware.service;

import com.hahnsoftware.hahnsoftware.exception.ResourceNotFoundException;
import com.hahnsoftware.hahnsoftware.exception.UnauthorizedActionException;
import com.hahnsoftware.hahnsoftware.models.Project;
import com.hahnsoftware.hahnsoftware.models.Task;
import com.hahnsoftware.hahnsoftware.repository.ProjectRepository;
import com.hahnsoftware.hahnsoftware.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

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
        Project project = projectRepository.findByIdAndUser_Email(projectId, userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Task task = Task.builder()
                .title(title)
                .description(description)
                .dueDate(dueDate)
                .completed(false)
                .project(project)
                .build();

        return taskRepository.save(task);
    }

    @Override
    public List<Task> getTasksByProject(Long projectId, String userEmail) {
        projectRepository.findByIdAndUser_Email(projectId, userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        return taskRepository.findByProject_Id(projectId);
    }

    @Override
    public Task toggleTask(Long taskId, String userEmail) {
        Task task = taskRepository.findByIdWithProject(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        Project project = task.getProject();
        if (project == null) {
            throw new ResourceNotFoundException("Task project not found");
        }
        
        projectRepository.findByIdAndUser_Email(project.getId(), userEmail)
                .orElseThrow(() -> new UnauthorizedActionException("Unauthorized access"));

        task.setCompleted(!task.isCompleted());

        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Long taskId, String title, String description, LocalDate dueDate, String userEmail) {
        Task task = taskRepository.findByIdWithProject(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        Project project = task.getProject();
        if (project == null) {
            throw new ResourceNotFoundException("Task project not found");
        }
        
        projectRepository.findByIdAndUser_Email(project.getId(), userEmail)
                .orElseThrow(() -> new UnauthorizedActionException("Unauthorized access"));

        task.setTitle(title);
        task.setDescription(description);
        task.setDueDate(dueDate);

        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long taskId, String userEmail) {
        Task task = taskRepository.findByIdWithProject(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        Project project = task.getProject();
        if (project == null) {
            throw new ResourceNotFoundException("Task project not found");
        }
        
        projectRepository.findByIdAndUser_Email(project.getId(), userEmail)
                .orElseThrow(() -> new UnauthorizedActionException("Unauthorized access"));

        taskRepository.delete(task);
    }
}

