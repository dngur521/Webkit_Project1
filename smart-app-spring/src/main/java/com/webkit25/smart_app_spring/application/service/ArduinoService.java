package com.webkit25.smart_app_spring.application.service;

import com.webkit25.smart_app_spring.domain.model.AirconHistory;
import com.webkit25.smart_app_spring.domain.model.SensorData;
import com.webkit25.smart_app_spring.domain.repository.AirconHistoryRepository;
import com.webkit25.smart_app_spring.domain.repository.SensorDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ArduinoService {
    private final RestTemplate restTemplate;
    private final AirconHistoryRepository airconHistoryRepository;
    private final SensorDataRepository sensorDataRepository;

    @Value("${raspberry-pi.base-url}")
    private String raspberryPiBaseUrl;

    // 아두이노에게 커맨드 보내기
    public Object sendCommandToArduino(Map<String, String> commandPayload) {
        String url = raspberryPiBaseUrl + "/arduino-command";
        return restTemplate.postForObject(url, commandPayload, Object.class);
    }

    // 센서 데이터 받아오기
    public Object getSensorDataFromRaspberryPi() {
        String url = raspberryPiBaseUrl + "/dht-sensor";
        return restTemplate.getForObject(url, Object.class);
    }

    // 에어컨 history를 pagination 적용해서 가져오기
    public Page<AirconHistory> getAirconHistory(int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("id").descending());
        return airconHistoryRepository.findAll(pageable);
    }

    // 온습도센서 history를 pagination 적용해서 가져오기
    public Page<SensorData> getDht11History(int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("id").descending());
        return sensorDataRepository.findAll(pageable);
    }
}
