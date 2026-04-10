package com.SmartRecruit.backend_springboot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
//Danh mục kỹ năng
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;

    @Column(unique = true, nullable = false, length = 50)
    private String skillName;
}