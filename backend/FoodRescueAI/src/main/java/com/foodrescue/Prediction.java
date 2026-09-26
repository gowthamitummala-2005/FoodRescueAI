package com.foodrescue;

import jakarta.persistence.*;

@Entity
@Table(name = "PREDICTIONS")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String foodName;
    private int quantity;
    private String eventType;

    private String wasteRisk;
    private String recommendedNgo;
    private String recommendation;

    private Double confidence;
    private Double wasteProbability;
    private Integer mealsSaved;
    private Double carbonSaved;

    private String status;
    private String predictionTime;

    public Prediction() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getWasteRisk() {
        return wasteRisk;
    }

    public void setWasteRisk(String wasteRisk) {
        this.wasteRisk = wasteRisk;
    }

    public String getRecommendedNgo() {
        return recommendedNgo;
    }

    public void setRecommendedNgo(String recommendedNgo) {
        this.recommendedNgo = recommendedNgo;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public Double getWasteProbability() {
        return wasteProbability;
    }

    public void setWasteProbability(Double wasteProbability) {
        this.wasteProbability = wasteProbability;
    }

    public Integer getMealsSaved() {
        return mealsSaved;
    }

    public void setMealsSaved(Integer mealsSaved) {
        this.mealsSaved = mealsSaved;
    }

    public Double getCarbonSaved() {
        return carbonSaved;
    }

    public void setCarbonSaved(Double carbonSaved) {
        this.carbonSaved = carbonSaved;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPredictionTime() {
        return predictionTime;
    }

    public void setPredictionTime(String predictionTime) {
        this.predictionTime = predictionTime;
    }
}