package com.SmartRecruit.backend_springboot.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity
@Table(name = "job_skills")
//Lưu trọng số của AI train cho từng công việc -> để đánh giá độ phù hợp
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class JobSkill {

    @EmbeddedId
    private JobSkillId id;

    @ManyToOne
    @MapsId("jobId")
    @JoinColumn(name = "job_id")
    private JobPosting jobPosting;

    @ManyToOne
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private Skill skill;

    private Integer importanceWeight = 1;

    @Embeddable
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class JobSkillId implements Serializable {
        private Integer jobId;
        private Integer skillId;
    }
}