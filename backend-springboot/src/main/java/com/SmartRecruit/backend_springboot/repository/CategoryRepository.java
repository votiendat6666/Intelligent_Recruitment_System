package com.SmartRecruit.backend_springboot.repository;

import com.SmartRecruit.backend_springboot.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // Lấy các danh mục gốc (không có parent)
    List<Category> findByParentIsNull();
}