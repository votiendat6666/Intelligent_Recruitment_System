package com.SmartRecruit.backend_springboot.controller;

import com.SmartRecruit.backend_springboot.entity.Category;
import com.SmartRecruit.backend_springboot.service.Data.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Lấy toàn bộ cây danh mục
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllRootCategories());
    }

    // Tạo danh mục mới (nếu truyền parentId thì nó là con)
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.saveCategory(category));
    }
}