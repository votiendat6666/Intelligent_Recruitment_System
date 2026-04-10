package com.SmartRecruit.backend_springboot.entity;

import com.SmartRecruit.backend_springboot.entity.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    private JobPosting jobPosting;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id")
    private User candidate;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(precision = 5, scale = 2)
    private BigDecimal aiMatchingScore;

    private LocalDateTime appliedAt;

    @PrePersist
    protected void onCreate() { appliedAt = LocalDateTime.now(); }
}