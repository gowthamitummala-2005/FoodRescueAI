package com.foodrescue;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurants")
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ============================================================
    // RESTAURANT DETAILS
    // ============================================================

    @Column(nullable = false)
    private String name;

    private String address;

    private String city;

    private String cuisine;

    private String phone;

    private String email;

    // ============================================================
    // RESTAURANT LOCATION
    // ============================================================

    private Double latitude;

    private Double longitude;

    // ============================================================
    // FOOD DATA
    // ============================================================

    private Double averageDailyFoodKg;

    private Double averageDailyWasteKg;

    private Double surplusFoodKg;

    // ============================================================
    // FSSAI DETAILS
    // ============================================================

    private String fssaiLicenseNumber;

    private String fssaiLicenseType;

    private String fssaiLicenseExpiryDate;

    private String fssaiStatus;

    // ============================================================
    // FOOD SAFETY OFFICER
    // ============================================================

    private String foodSafetyOfficerName;

    private String foodSafetyOfficerContact;

    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public Restaurant() {
    }

    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getAverageDailyFoodKg() {
        return averageDailyFoodKg;
    }

    public void setAverageDailyFoodKg(
            Double averageDailyFoodKg) {

        this.averageDailyFoodKg =
                averageDailyFoodKg;
    }

    public Double getAverageDailyWasteKg() {
        return averageDailyWasteKg;
    }

    public void setAverageDailyWasteKg(
            Double averageDailyWasteKg) {

        this.averageDailyWasteKg =
                averageDailyWasteKg;
    }

    public Double getSurplusFoodKg() {
        return surplusFoodKg;
    }

    public void setSurplusFoodKg(
            Double surplusFoodKg) {

        this.surplusFoodKg =
                surplusFoodKg;
    }

    // ============================================================
    // FSSAI GETTERS / SETTERS
    // ============================================================

    public String getFssaiLicenseNumber() {
        return fssaiLicenseNumber;
    }

    public void setFssaiLicenseNumber(
            String fssaiLicenseNumber) {

        this.fssaiLicenseNumber =
                fssaiLicenseNumber;
    }

    public String getFssaiLicenseType() {
        return fssaiLicenseType;
    }

    public void setFssaiLicenseType(
            String fssaiLicenseType) {

        this.fssaiLicenseType =
                fssaiLicenseType;
    }

    public String getFssaiLicenseExpiryDate() {
        return fssaiLicenseExpiryDate;
    }

    public void setFssaiLicenseExpiryDate(
            String fssaiLicenseExpiryDate) {

        this.fssaiLicenseExpiryDate =
                fssaiLicenseExpiryDate;
    }

    public String getFssaiStatus() {
        return fssaiStatus;
    }

    public void setFssaiStatus(
            String fssaiStatus) {

        this.fssaiStatus =
                fssaiStatus;
    }

    // ============================================================
    // FOOD SAFETY OFFICER GETTERS / SETTERS
    // ============================================================

    public String getFoodSafetyOfficerName() {
        return foodSafetyOfficerName;
    }

    public void setFoodSafetyOfficerName(
            String foodSafetyOfficerName) {

        this.foodSafetyOfficerName =
                foodSafetyOfficerName;
    }

    public String getFoodSafetyOfficerContact() {
        return foodSafetyOfficerContact;
    }

    public void setFoodSafetyOfficerContact(
            String foodSafetyOfficerContact) {

        this.foodSafetyOfficerContact =
                foodSafetyOfficerContact;
    }
}