package com.foodrescue;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RestaurantDataInitializer implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;

    public RestaurantDataInitializer(
            RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    @Override
    public void run(String... args) {

        // Don't insert duplicates every time Spring Boot starts
        if (restaurantRepository.count() > 0) {
            return;
        }

        // ============================================================
        // RESTAURANT 1
        // ============================================================

        Restaurant r1 = new Restaurant();

        r1.setName("Hyderabad Spice Kitchen");
        r1.setAddress("Uppal Main Road, Uppal");
        r1.setCity("Hyderabad");
        r1.setCuisine("Indian");
        r1.setPhone("9000000011");
        r1.setEmail("spicekitchen@example.com");

        r1.setLatitude(17.4050);
        r1.setLongitude(78.5591);

        r1.setAverageDailyFoodKg(120.0);
        r1.setAverageDailyWasteKg(25.0);
        r1.setSurplusFoodKg(18.0);

        r1.setFssaiLicenseNumber("FSSAI-DEMO-100001");
        r1.setFssaiLicenseType("Food Service Establishment");
        r1.setFssaiLicenseExpiryDate("2027-12-31");
        r1.setFssaiStatus("ACTIVE");

        r1.setFoodSafetyOfficerName("Demo Officer 1");
        r1.setFoodSafetyOfficerContact("9000000001");

        restaurantRepository.save(r1);


        // ============================================================
        // RESTAURANT 2
        // ============================================================

        Restaurant r2 = new Restaurant();

        r2.setName("Tarnaka Food Court");
        r2.setAddress("Tarnaka Main Road, Tarnaka");
        r2.setCity("Hyderabad");
        r2.setCuisine("Multi Cuisine");
        r2.setPhone("9000000012");
        r2.setEmail("tarnakafood@example.com");

        r2.setLatitude(17.4283);
        r2.setLongitude(78.5289);

        r2.setAverageDailyFoodKg(150.0);
        r2.setAverageDailyWasteKg(30.0);
        r2.setSurplusFoodKg(22.0);

        r2.setFssaiLicenseNumber("FSSAI-DEMO-100002");
        r2.setFssaiLicenseType("Food Service Establishment");
        r2.setFssaiLicenseExpiryDate("2027-11-30");
        r2.setFssaiStatus("ACTIVE");

        r2.setFoodSafetyOfficerName("Demo Officer 2");
        r2.setFoodSafetyOfficerContact("9000000002");

        restaurantRepository.save(r2);


        // ============================================================
        // RESTAURANT 3
        // ============================================================

        Restaurant r3 = new Restaurant();

        r3.setName("Ghatkesar Family Restaurant");
        r3.setAddress("Ghatkesar Main Road");
        r3.setCity("Hyderabad");
        r3.setCuisine("South Indian");
        r3.setPhone("9000000013");
        r3.setEmail("ghatkesarfood@example.com");

        r3.setLatitude(17.4500);
        r3.setLongitude(78.6850);

        r3.setAverageDailyFoodKg(100.0);
        r3.setAverageDailyWasteKg(20.0);
        r3.setSurplusFoodKg(15.0);

        r3.setFssaiLicenseNumber("FSSAI-DEMO-100003");
        r3.setFssaiLicenseType("Food Service Establishment");
        r3.setFssaiLicenseExpiryDate("2028-01-31");
        r3.setFssaiStatus("ACTIVE");

        r3.setFoodSafetyOfficerName("Demo Officer 3");
        r3.setFoodSafetyOfficerContact("9000000003");

        restaurantRepository.save(r3);


        // ============================================================
        // RESTAURANT 4
        // ============================================================

        Restaurant r4 = new Restaurant();

        r4.setName("Secunderabad Green Restaurant");
        r4.setAddress("S.D. Road, Secunderabad");
        r4.setCity("Hyderabad");
        r4.setCuisine("Vegetarian");
        r4.setPhone("9000000014");
        r4.setEmail("greenrestaurant@example.com");

        r4.setLatitude(17.4399);
        r4.setLongitude(78.4983);

        r4.setAverageDailyFoodKg(130.0);
        r4.setAverageDailyWasteKg(24.0);
        r4.setSurplusFoodKg(17.0);

        r4.setFssaiLicenseNumber("FSSAI-DEMO-100004");
        r4.setFssaiLicenseType("Food Service Establishment");
        r4.setFssaiLicenseExpiryDate("2027-10-31");
        r4.setFssaiStatus("ACTIVE");

        r4.setFoodSafetyOfficerName("Demo Officer 4");
        r4.setFoodSafetyOfficerContact("9000000004");

        restaurantRepository.save(r4);


        System.out.println(
                "========================================"
        );
        System.out.println(
                "Restaurant sample data inserted successfully!"
        );
        System.out.println(
                "Total restaurants: "
                        + restaurantRepository.count()
        );
        System.out.println(
                "========================================"
        );
    }
}