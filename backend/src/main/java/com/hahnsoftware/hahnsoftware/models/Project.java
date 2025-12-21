package com.hahnsoftware.hahnsoftware.models;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false )
    private String title ;

    private String description ;

    @ManyToOne
    @JoinColumn(name="user_id",nullable=false)
    private User user ;

    @OneToMany(mappedBy="project")
    private List<Task> tasks ;
}
