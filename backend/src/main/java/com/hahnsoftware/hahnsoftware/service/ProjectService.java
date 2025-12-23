package com.hahnsoftware.hahnsoftware.service;

import com.hahnsoftware.hahnsoftware.models.Project;

public interface ProjectService {

    Project createProject(String title , String description , String userEmail );

}
