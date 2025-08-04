package com.example.ChatService.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.util.Pair;

import java.util.Set;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomCreationDto {

    @NotBlank(message = "Owner User is required")
    private Long ownerId;
    private String roomName = "New Room";
    private Set<UserDTO> users;
}
