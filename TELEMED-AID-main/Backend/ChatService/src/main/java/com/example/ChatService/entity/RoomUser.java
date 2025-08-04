package com.example.ChatService.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room_user_ids")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    @ToString.Exclude
    private Room room;
}
