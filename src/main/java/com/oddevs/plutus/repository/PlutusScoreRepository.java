package com.oddevs.plutus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oddevs.plutus.model.PlutusScore;

@Repository
public interface PlutusScoreRepository extends JpaRepository<PlutusScore, Long> {

}
