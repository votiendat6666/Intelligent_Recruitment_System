package com.SmartRecruit.backend_springboot.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity
@Table(name = "candidate_skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CandidateSkill {

    @EmbeddedId
    private CandidateSkillId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("profileId") // Khớp với biến profileId trong CandidateSkillId
    @JoinColumn(name = "profile_id") // Khớp với cột profile_id trong SQL
    private CandidateProfile candidateProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("skillId") // Khớp với biến skillId trong CandidateSkillId
    @JoinColumn(name = "skill_id") // Khớp với cột skill_id trong SQL
    private Skill skill;

    private Integer proficiencyLevel;

    @Embeddable
    @Data @NoArgsConstructor @AllArgsConstructor
    public static class CandidateSkillId implements Serializable {
        private Integer profileId;
        private Integer skillId;
    }
}