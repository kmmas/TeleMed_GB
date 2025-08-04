package com.example.ChatService.repository;

import com.example.ChatService.entity.Message;
import com.example.ChatService.entity.Room;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("""
    SELECT DISTINCT r
    FROM Room r
    JOIN r.roomUsers ruFilter
    LEFT JOIN FETCH r.roomUsers ruAll
    WHERE ruFilter.userId = :userId
    """)
    List<Room> findRoomsWithAllUsersByUserId(@Param("userId") Long userId);

}
