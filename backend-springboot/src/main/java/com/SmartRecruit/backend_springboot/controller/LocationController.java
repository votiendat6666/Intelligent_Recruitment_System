package com.SmartRecruit.backend_springboot.controller;

import com.SmartRecruit.backend_springboot.entity.Location;
import com.SmartRecruit.backend_springboot.service.Data.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*") // Cho phép React gọi API mà không bị chặn bởi CORS
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping
    public ResponseEntity<List<Location>> getAllLocations() {
        List<Location> locations = locationService.getAllLocations();
        return ResponseEntity.ok(locations);
    }
}