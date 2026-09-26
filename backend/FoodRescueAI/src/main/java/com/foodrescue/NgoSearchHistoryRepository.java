package com.foodrescue;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NgoSearchHistoryRepository
        extends JpaRepository<NgoSearchHistory, Long> {

    List<NgoSearchHistory> findTop20ByOrderBySearchedAtDesc();
}