package com.foodrescue;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ngo-history")
public class NgoSearchHistoryController {

    private final NgoSearchHistoryRepository repository;

    public NgoSearchHistoryController(
            NgoSearchHistoryRepository repository) {

        this.repository = repository;
    }

    @GetMapping
    public List<NgoSearchHistory> getHistory() {

        return repository
                .findTop20ByOrderBySearchedAtDesc();
    }
}