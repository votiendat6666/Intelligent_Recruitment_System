package com.SmartRecruit.backend_springboot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companies")
//Thông tin nhà tuyển dụng
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;

    @Column(nullable = false, length = 150)
    private String name;

    private String website;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String logoUrl;
}