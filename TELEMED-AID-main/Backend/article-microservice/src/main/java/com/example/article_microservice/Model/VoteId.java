package com.example.article_microservice.Model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VoteId implements Serializable {
    private Long doctorId;
    private Long commentId;

    @Override
    public int hashCode() {
        return Objects.hash(doctorId, commentId);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if(!(obj instanceof VoteId voteId)) return false;
        return Objects.equals(doctorId, voteId.doctorId)
                && Objects.equals(commentId, voteId.commentId);
    }
}
