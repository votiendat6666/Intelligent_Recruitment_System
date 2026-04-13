package com.SmartRecruit.backend_springboot.service.Data;

import com.SmartRecruit.backend_springboot.entity.Category;
import com.SmartRecruit.backend_springboot.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllRootCategories() {
        return categoryRepository.findByParentIsNull();
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }
}