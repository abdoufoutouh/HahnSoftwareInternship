package com.hahnsoftware.hahnsoftware.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "projects")
@Data
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

    // cascade = CascadeType : ALL Quand tu fais une action sur Project, elle s’applique aussi aux Task.
    //  orphanRemoval = nettoyage automatique

    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Task> tasks;

    public void setTitle(String title) {this.title = title;}
    public void setDescription(String description) {this.description = description;}
    public void setUser(User user) {this.user = user;}

}
