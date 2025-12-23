package com.hahnsoftware.hahnsoftware.controllers.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProjectProgressResponse {

    private Long projectId;
    private int totalTasks;
    private int completedTasks;
    private int progressPercentage;

}
