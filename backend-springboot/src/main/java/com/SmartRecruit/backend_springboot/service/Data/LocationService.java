package com.SmartRecruit.backend_springboot.service.Data;

import com.SmartRecruit.backend_springboot.entity.Location;
import com.SmartRecruit.backend_springboot.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }
}