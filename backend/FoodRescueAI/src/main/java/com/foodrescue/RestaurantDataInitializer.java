package com.foodrescue;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RestaurantDataInitializer implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;

    public RestaurantDataInitializer(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    @Override
    public void run(String... args) {

        // If 50 or more restaurants already exist, do nothing
        if (restaurantRepository.count() >= 50) {
            System.out.println("50 or more restaurants already exist.");
            return;
        }

        List<String[]> data = List.of(

            new String[]{"Hyderabad Spice Kitchen", "Uppal Main Road, Uppal", "Indian", "17.4050", "78.5591"},
            new String[]{"Tarnaka Food Court", "Tarnaka Main Road, Tarnaka", "Multi Cuisine", "17.4283", "78.5289"},
            new String[]{"Ghatkesar Family Restaurant", "Ghatkesar Main Road", "South Indian", "17.4500", "78.6850"},
            new String[]{"Secunderabad Green Restaurant", "S.D. Road, Secunderabad", "Vegetarian", "17.4399", "78.4983"},
            new String[]{"Uppal Food Plaza", "Nagole Road, Uppal", "Indian", "17.4055", "78.5670"},
            new String[]{"Habsiguda Spice Hub", "Habsiguda Main Road", "Indian", "17.4239", "78.5430"},
            new String[]{"Nacharam Family Kitchen", "Nacharam Main Road", "South Indian", "17.4350", "78.5650"},
            new String[]{"Ramanthapur Food House", "Ramanthapur Main Road", "Multi Cuisine", "17.3950", "78.5420"},
            new String[]{"Amberpet Food Corner", "Amberpet Main Road", "Indian", "17.3720", "78.5200"},
            new String[]{"Dilsukhnagar Spice Restaurant", "Dilsukhnagar Main Road", "Indian", "17.3688", "78.5247"},

            new String[]{"LB Nagar Food Court", "LB Nagar Main Road", "Multi Cuisine", "17.3457", "78.5522"},
            new String[]{"Kothapet Family Restaurant", "Kothapet Main Road", "South Indian", "17.3680", "78.5350"},
            new String[]{"Nagole Green Kitchen", "Nagole Main Road", "Vegetarian", "17.3710", "78.5680"},
            new String[]{"Malkajgiri Food Plaza", "Malkajgiri Main Road", "Indian", "17.4490", "78.5360"},
            new String[]{"ECIL Spice Kitchen", "ECIL Main Road", "Indian", "17.4720", "78.5730"},
            new String[]{"Kapra Family Restaurant", "Kapra Main Road", "Multi Cuisine", "17.4750", "78.5660"},
            new String[]{"Sainikpuri Food Hub", "Sainikpuri Main Road", "South Indian", "17.4850", "78.5450"},
            new String[]{"AS Rao Nagar Kitchen", "A.S. Rao Nagar", "Indian", "17.4780", "78.5560"},
            new String[]{"Kompally Food Court", "Kompally Main Road", "Multi Cuisine", "17.5400", "78.4900"},
            new String[]{"Alwal Green Restaurant", "Alwal Main Road", "Vegetarian", "17.5000", "78.5050"},

            new String[]{"Bowenpally Family Kitchen", "Bowenpally Main Road", "Indian", "17.4680", "78.4800"},
            new String[]{"Begumpet Food Plaza", "Begumpet Main Road", "Multi Cuisine", "17.4440", "78.4660"},
            new String[]{"Paradise Spice Restaurant", "Paradise Circle", "Indian", "17.4420", "78.4860"},
            new String[]{"Marredpally Food House", "West Marredpally", "South Indian", "17.4550", "78.5060"},
            new String[]{"Karkhana Family Restaurant", "Karkhana Main Road", "Multi Cuisine", "17.4680", "78.5090"},
            new String[]{"Musheerabad Spice Kitchen", "Musheerabad Main Road", "Indian", "17.4250", "78.5010"},
            new String[]{"Chikkadpally Food Court", "Chikkadpally Main Road", "Multi Cuisine", "17.4050", "78.5000"},
            new String[]{"Himayatnagar Green Kitchen", "Himayatnagar", "Vegetarian", "17.4000", "78.4800"},
            new String[]{"Koti Family Restaurant", "Koti Main Road", "Indian", "17.3850", "78.4900"},
            new String[]{"Abids Food Plaza", "Abids Main Road", "Multi Cuisine", "17.3920", "78.4750"},

            new String[]{"Nampally Spice Restaurant", "Nampally Main Road", "Indian", "17.3920", "78.4630"},
            new String[]{"Mehdipatnam Food Court", "Mehdipatnam Main Road", "Multi Cuisine", "17.3950", "78.4350"},
            new String[]{"Tolichowki Family Kitchen", "Tolichowki Main Road", "Indian", "17.3970", "78.4150"},
            new String[]{"Attapur Food House", "Attapur Main Road", "South Indian", "17.3680", "78.4250"},
            new String[]{"Rajendranagar Green Restaurant", "Rajendranagar Main Road", "Vegetarian", "17.3200", "78.4050"},
            new String[]{"Kukatpally Spice Kitchen", "Kukatpally Main Road", "Indian", "17.4850", "78.3920"},
            new String[]{"KPHB Food Plaza", "KPHB Main Road", "Multi Cuisine", "17.4950", "78.3990"},
            new String[]{"Miyapur Family Restaurant", "Miyapur Main Road", "Indian", "17.4960", "78.3570"},
            new String[]{"Bachupally Food Court", "Bachupally Main Road", "Multi Cuisine", "17.5350", "78.3500"},
            new String[]{"Chandanagar Spice Restaurant", "Chandanagar Main Road", "Indian", "17.4950", "78.3300"},

            new String[]{"Gachibowli Green Kitchen", "Gachibowli Main Road", "Vegetarian", "17.4400", "78.3480"},
            new String[]{"Madhapur Food Hub", "Madhapur Main Road", "Multi Cuisine", "17.4480", "78.3910"},
            new String[]{"Hitech City Family Restaurant", "Hitech City Main Road", "Indian", "17.4500", "78.3800"},
            new String[]{"Kondapur Spice Kitchen", "Kondapur Main Road", "Indian", "17.4580", "78.3630"},
            new String[]{"Jubilee Hills Food Plaza", "Jubilee Hills Road", "Multi Cuisine", "17.4320", "78.4070"},
            new String[]{"Banjara Hills Family Kitchen", "Banjara Hills Road", "Indian", "17.4150", "78.4480"},
            new String[]{"Somajiguda Food Court", "Somajiguda Main Road", "Multi Cuisine", "17.4250", "78.4590"},
            new String[]{"Ameerpet Green Restaurant", "Ameerpet Main Road", "Vegetarian", "17.4370", "78.4480"},
            new String[]{"SR Nagar Food House", "S.R. Nagar Main Road", "South Indian", "17.4430", "78.4400"},
            new String[]{"Punjagutta Spice Restaurant", "Punjagutta Main Road", "Indian", "17.4310", "78.4530"}
        );

        int existingCount = (int) restaurantRepository.count();
        int added = 0;

        for (int i = existingCount; i < data.size(); i++) {

            String[] d = data.get(i);

            Restaurant restaurant = new Restaurant();

            restaurant.setName(d[0]);
            restaurant.setAddress(d[1]);
            restaurant.setCity("Hyderabad");
            restaurant.setCuisine(d[2]);

            restaurant.setPhone("90000000" + String.format("%02d", i + 1));
            restaurant.setEmail(
                    "restaurant" + (i + 1) + "@foodrescueai.demo"
            );

            restaurant.setLatitude(Double.parseDouble(d[3]));
            restaurant.setLongitude(Double.parseDouble(d[4]));

            // Demo food statistics
            restaurant.setAverageDailyFoodKg(
                    80.0 + ((i * 13) % 100)
            );

            restaurant.setAverageDailyWasteKg(
                    15.0 + ((i * 5) % 25)
            );

            restaurant.setSurplusFoodKg(
                    10.0 + ((i * 4) % 20)
            );

            // DEMO FSSAI information
            restaurant.setFssaiLicenseNumber(
                    "FSSAI-DEMO-" + String.format("%06d", i + 1)
            );

            restaurant.setFssaiLicenseType(
                    "Food Service Establishment"
            );

            restaurant.setFssaiLicenseExpiryDate(
                    "2027-12-31"
            );

            restaurant.setFssaiStatus("ACTIVE");

            // DEMO Food Safety Officer information
            restaurant.setFoodSafetyOfficerName(
                    "Demo Food Safety Officer " + (i + 1)
            );

            restaurant.setFoodSafetyOfficerContact(
                    "90000000" + String.format("%02d", i + 1)
            );

            restaurantRepository.save(restaurant);

            added++;
        }

        System.out.println("--------------------------------------------");
        System.out.println("FoodRescueAI Restaurant Data");
        System.out.println("--------------------------------------------");
        System.out.println("Restaurants added: " + added);
        System.out.println(
                "Total restaurants: " + restaurantRepository.count()
        );
        System.out.println("--------------------------------------------");
    }
}