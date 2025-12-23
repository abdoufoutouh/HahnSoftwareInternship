package com.hahnsoftware.hahnsoftware.service;

import com.hahnsoftware.hahnsoftware.models.Task;

import java.time.LocalDate;
import java.util.List;

public interface TaskService {
    
    Task createTask(Long projectId, String title, String description, LocalDate dueDate, String userEmail);
    
    List<Task> getTasksByProject(Long projectId, String userEmail);
    
    Task toggleTask(Long taskId, String userEmail);
    
    Task updateTask(Long taskId, String title, String description, LocalDate dueDate, String userEmail);
    
    void deleteTask(Long taskId, String userEmail);
}

