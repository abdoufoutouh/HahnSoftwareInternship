package com.hahnsoftware.hahnsoftware.service;

import com.hahnsoftware.hahnsoftware.models.Task;

import java.time.LocalDate;

public interface TaskService {
    
    Task createTask(Long projectId, String title, String description, LocalDate dueDate, String userEmail);
}

