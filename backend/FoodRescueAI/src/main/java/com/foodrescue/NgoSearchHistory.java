package com.foodrescue;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "ngo_search_history")
public class NgoSearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String searchedLocation;

    private double latitude;

    private double longitude;

    private int resultCount;

    private LocalDateTime searchedAt;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public NgoSearchHistory() {
    }


    // =========================================================
    // GETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public String getSearchedLocation() {
        return searchedLocation;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public int getResultCount() {
        return resultCount;
    }

    public LocalDateTime getSearchedAt() {
        return searchedAt;
    }


    // =========================================================
    // SETTERS
    // =========================================================

    public void setId(Long id) {
        this.id = id;
    }

    public void setSearchedLocation(
            String searchedLocation) {

        this.searchedLocation =
                searchedLocation;
    }

    public void setLatitude(
            double latitude) {

        this.latitude = latitude;
    }

    public void setLongitude(
            double longitude) {

        this.longitude = longitude;
    }

    public void setResultCount(
            int resultCount) {

        this.resultCount =
                resultCount;
    }

    public void setSearchedAt(
            LocalDateTime searchedAt) {

        this.searchedAt =
                searchedAt;
    }
}