package com.example.article_microservice.Repository;

import com.example.article_microservice.Model.Vote;
import com.example.article_microservice.Model.VoteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, VoteId> {
    Optional<Vote> findByVoteId(VoteId voteId);
}

