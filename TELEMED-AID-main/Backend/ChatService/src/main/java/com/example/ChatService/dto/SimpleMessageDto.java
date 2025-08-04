package com.example.ChatService.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimpleMessageDto {

    private Long id;
    @NotBlank(message = "Sender ID is required")
    private Long senderId;
    private String senderName;
    private String content;
    private Date createdAt;

}
