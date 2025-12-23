package com.hahnsoftware.hahnsoftware.repository;

import com.hahnsoftware.hahnsoftware.models.Project;
import com.hahnsoftware.hahnsoftware.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository  extends JpaRepository<Task, Long> {

    List<Task> findByProject_Id(Long projectId);

    Optional<Task> findByIdAndProject_Id(Long taskId, Long projectId);

    @Query("SELECT t FROM Task t JOIN FETCH t.project WHERE t.id = :taskId")
    Optional<Task> findByIdWithProject(@Param("taskId") Long taskId);

}
