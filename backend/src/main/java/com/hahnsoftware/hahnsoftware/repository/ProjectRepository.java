package com.hahnsoftware.hahnsoftware.repository;

import com.hahnsoftware.hahnsoftware.models.Project;
import com.hahnsoftware.hahnsoftware.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByUser(User user);

}
