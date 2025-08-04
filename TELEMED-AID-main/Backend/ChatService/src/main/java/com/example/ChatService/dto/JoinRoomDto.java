package com.example.ChatService.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoinRoomDto {
    @NotBlank(message = "Room ID is required")
    private Long roomId;

    Set<UserDTO> users;
}
