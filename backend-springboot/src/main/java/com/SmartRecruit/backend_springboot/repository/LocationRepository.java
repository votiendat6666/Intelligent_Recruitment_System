package com.SmartRecruit.backend_springboot.repository;

import com.SmartRecruit.backend_springboot.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {
}