package com.SmartRecruit.backend_springboot.entity;

import com.SmartRecruit.backend_springboot.entity.JobPosting;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "locations")
@Data
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "city_name", nullable = false)
    private String cityName;

    // Một địa điểm có thể có nhiều bài đăng tuyển dụng
    @OneToMany(mappedBy = "location")
    @JsonIgnore
    private List<JobPosting> jobPostings;
}