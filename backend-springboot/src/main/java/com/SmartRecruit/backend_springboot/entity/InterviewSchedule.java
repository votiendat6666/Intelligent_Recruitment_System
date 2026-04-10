package com.SmartRecruit.backend_springboot.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_schedules")
//Lịch hẹn phỏng vấn
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class InterviewSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    @ManyToOne
    @JoinColumn(name = "interviewer_id")
    private User interviewer;

    @Column(nullable = false)
    private LocalDateTime scheduledTime;

    private String locationLink;

    @Column(columnDefinition = "TEXT")
    private String notes;
}