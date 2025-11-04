package com.webkit25.smart_app_spring.api.request;

import lombok.Data;

// { "command" : "command_1" } 형식
@Data
public class SendCommandRequest {
    private String command;
}
