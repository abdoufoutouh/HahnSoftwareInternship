package com.hahnsoftware.hahnsoftware.repository;

import com.hahnsoftware.hahnsoftware.models.Project;
import com.hahnsoftware.hahnsoftware.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByUser(User user);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.tasks WHERE p.user.email = :email")
    List<Project> findAllByUser_Email(@Param("email") String email);


    Optional<Project> findByIdAndUser_Email(Long projectId, String email);

}
