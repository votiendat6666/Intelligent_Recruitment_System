package com.SmartRecruit.backend_springboot.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor   // Thêm cái này
@AllArgsConstructor  // Thêm cái này
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false) // Đánh dấu bắt buộc trong database
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonBackReference
    private Category parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.EAGER) // Nên dùng EAGER để lấy luôn con cho menu
    @JsonManagedReference
    private List<Category> children;

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    private List<JobPosting> jobPostings;
}