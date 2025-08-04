package com.example.article_microservice.DTO.Question;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VoteDTO {
    @NotNull(message = "No comment chosen")
    private Long commentId;
    @NotNull(message = "No doctor chosen")
    private Long doctorId;
    @NotNull(message = "No rank given")
    @Min(-1)
    @Max(1)
    private Integer rank;
    @AssertTrue(message = "Rank cannot be zero")
    public boolean isRankNotZero() {
        return rank != 0;
    }
}
