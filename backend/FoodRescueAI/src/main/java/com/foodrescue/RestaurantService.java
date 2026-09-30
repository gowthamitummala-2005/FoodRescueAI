package com.foodrescue;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public RestaurantService(
            RestaurantRepository restaurantRepository) {

        this.restaurantRepository =
                restaurantRepository;
    }

    // ============================================================
    // GET ALL
    // ============================================================

    public List<Restaurant> getAllRestaurants() {

        return restaurantRepository.findAll();
    }

    // ============================================================
    // GET BY ID
    // ============================================================

    public Restaurant getRestaurantById(Long id) {

        return restaurantRepository
                .findById(id)
                .orElse(null);
    }

    // ============================================================
    // ADD
    // ============================================================

    public Restaurant addRestaurant(
            Restaurant restaurant) {

        return restaurantRepository.save(
                restaurant
        );
    }

    // ============================================================
    // UPDATE
    // ============================================================

    public Restaurant updateRestaurant(
            Long id,
            Restaurant updatedRestaurant) {

        Restaurant existing =
                restaurantRepository
                        .findById(id)
                        .orElse(null);

        if (existing == null) {
            return null;
        }

        // Restaurant details
        existing.setName(
                updatedRestaurant.getName()
        );

        existing.setAddress(
                updatedRestaurant.getAddress()
        );

        existing.setCity(
                updatedRestaurant.getCity()
        );

        existing.setCuisine(
                updatedRestaurant.getCuisine()
        );

        existing.setPhone(
                updatedRestaurant.getPhone()
        );

        existing.setEmail(
                updatedRestaurant.getEmail()
        );

        // Location
        existing.setLatitude(
                updatedRestaurant.getLatitude()
        );

        existing.setLongitude(
                updatedRestaurant.getLongitude()
        );

        // Food data
        existing.setAverageDailyFoodKg(
                updatedRestaurant
                        .getAverageDailyFoodKg()
        );

        existing.setAverageDailyWasteKg(
                updatedRestaurant
                        .getAverageDailyWasteKg()
        );

        existing.setSurplusFoodKg(
                updatedRestaurant
                        .getSurplusFoodKg()
        );

        // FSSAI
        existing.setFssaiLicenseNumber(
                updatedRestaurant
                        .getFssaiLicenseNumber()
        );

        existing.setFssaiLicenseType(
                updatedRestaurant
                        .getFssaiLicenseType()
        );

        existing.setFssaiLicenseExpiryDate(
                updatedRestaurant
                        .getFssaiLicenseExpiryDate()
        );

        existing.setFssaiStatus(
                updatedRestaurant
                        .getFssaiStatus()
        );

        // Food Safety Officer
        existing.setFoodSafetyOfficerName(
                updatedRestaurant
                        .getFoodSafetyOfficerName()
        );

        existing.setFoodSafetyOfficerContact(
                updatedRestaurant
                        .getFoodSafetyOfficerContact()
        );

        return restaurantRepository.save(
                existing
        );
    }

    // ============================================================
    // DELETE
    // ============================================================

    public boolean deleteRestaurant(Long id) {

        if (!restaurantRepository.existsById(id)) {
            return false;
        }

        restaurantRepository.deleteById(id);

        return true;
    }
}