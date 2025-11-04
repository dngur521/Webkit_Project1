package com.webkit25.smart_app_spring.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "history") // Matches your database table name
@Getter
@NoArgsConstructor
public class AirconHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String command;

    private String response;

    private LocalDateTime timestamp;
}

