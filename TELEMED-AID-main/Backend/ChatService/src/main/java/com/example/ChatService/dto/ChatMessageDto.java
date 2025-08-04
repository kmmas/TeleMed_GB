package com.example.ChatService.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChatMessageDto {
    @NotBlank(message = "Sender ID is required")
    private Long senderId;

    private String content;

    @NotBlank(message = "Room ID is required")
    private Long roomId;
}
