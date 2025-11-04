package com.webkit25.smart_app_spring.api.controller;


import com.webkit25.smart_app_spring.api.request.SendCommandRequest;
import com.webkit25.smart_app_spring.application.service.ArduinoService;
import com.webkit25.smart_app_spring.domain.model.AirconHistory;
import com.webkit25.smart_app_spring.domain.model.SensorData;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/arduino")
@RequiredArgsConstructor
public class ArduinoController {
    private final ArduinoService arduinoService;

    // router.post('/send-command', ...)
    @PostMapping("/send-command")
    public ResponseEntity<?> sendCommand(@RequestBody SendCommandRequest request) {
        try {
            // The request body is automatically mapped to SendCommandRequest
            Object response = arduinoService.sendCommandToArduino(Collections.singletonMap("command", request.getCommand()));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("message", "Failed to communicate with Raspberry Pi."));
        }
    }

    // router.get('/dht-sensor', ...)
    @GetMapping("/dht-sensor")
    public ResponseEntity<?> getSensorData() {
        try {
            Object response = arduinoService.getSensorDataFromRaspberryPi();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.singletonMap("message", "Failed to communicate with Raspberry Pi."));
        }
    }

    // router.get('/aircon-history', ...)
    @GetMapping("/aircon-history")
    public ResponseEntity<Page<AirconHistory>> getAirconHistory(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Page<AirconHistory> historyPage = arduinoService.getAirconHistory(page, limit);
        return ResponseEntity.ok(historyPage);
    }

    // router.get('/dht-history', ...)
    @GetMapping("/dht-history")
    public ResponseEntity<Page<SensorData>> getDhtHistory(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Page<SensorData> sensorDataPage = arduinoService.getDht11History(page, limit);
        return ResponseEntity.ok(sensorDataPage);
    }
}
