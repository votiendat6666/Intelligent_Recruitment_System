package com.SmartRecruit.backend_springboot.entity;

import com.SmartRecruit.backend_springboot.entity.enums.JobPostingType;
import com.SmartRecruit.backend_springboot.entity.enums.JobPostingStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_postings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JobPosting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id")
    private User recruiter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobPostingType jobType;

    private String experienceLevel;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String requirements;

    @Enumerated(EnumType.STRING)
    private JobPostingStatus status = JobPostingStatus.DRAFT;

    private LocalDateTime expiredAt;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }
}