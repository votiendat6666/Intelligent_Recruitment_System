package com.SmartRecruit.backend_springboot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidate_profiles")
//Chi tiết hồ sơ của ứng viên.
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CandidateProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private Integer yearsOfExperience;
    private String educationLevel;
    private String currentJobTitle;
    private String cvUrl;
}