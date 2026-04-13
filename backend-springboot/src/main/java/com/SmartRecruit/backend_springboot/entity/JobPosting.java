package com.SmartRecruit.backend_springboot.entity;

import com.SmartRecruit.backend_springboot.entity.enums.JobPostingType;
import com.SmartRecruit.backend_springboot.entity.enums.JobPostingStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_postings")
@Data
public class JobPosting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    private BigDecimal salaryMin;
    private BigDecimal salaryMax;

    @Enumerated(EnumType.STRING)
    private JobPostingType jobType; // FULL_TIME, PART_TIME...

    // Nối với Company
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    // Nối với Location (Bảng vừa tạo)
    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    // Nối với Category (Vị trí/Ngành nghề)
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Cột JSON để lưu Vector AI (Dùng String hoặc mảng tùy thư viện hỗ trợ)
    @Column(name = "job_vector", columnDefinition = "json")
    private String jobVector;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}