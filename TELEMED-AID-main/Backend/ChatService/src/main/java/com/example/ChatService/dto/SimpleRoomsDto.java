package com.example.ChatService.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimpleRoomsDto {
    @NotBlank(message = "Room ID is required")
    private Long roomId;

    @NotBlank(message = "user ID is required")
    private Long ownerId;

    private String roomName = "New Room";

    @NotBlank(message = "Last Message is required")
    private  String lastMessage;

    private List<String> participants;

}
