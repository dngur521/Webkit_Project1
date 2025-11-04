package com.webkit25.smart_app_spring.domain.repository;

import com.webkit25.smart_app_spring.domain.model.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
}
