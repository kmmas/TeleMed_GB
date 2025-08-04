package com.example.ChatService.exceptions;

public class RoomCreationException extends RuntimeException {
    public RoomCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}
