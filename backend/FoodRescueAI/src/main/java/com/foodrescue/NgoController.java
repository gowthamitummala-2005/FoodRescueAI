package com.foodrescue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ngos")
@CrossOrigin(origins = "http://localhost:5173")
public class NgoController {

    private final NgoService ngoService;

    public NgoController(NgoService ngoService) {
        this.ngoService = ngoService;
    }

    /*
     * MAIN SEARCH ENDPOINT
     *
     * Example:
     * /api/ngos/search?location=Tarnaka&limit=15
     */
    @GetMapping("/search")
    public Map<String, Object> search(
            @RequestParam("location") String location,
            @RequestParam(defaultValue = "15") int limit) {

        Map<String, Object> response =
                new HashMap<>();

        try {

            if (location == null || location.trim().isEmpty()) {

                response.put(
                        "success",
                        false
                );

                response.put(
                        "message",
                        "Please enter a location"
                );

                response.put(
                        "ngos",
                        List.of()
                );

                return response;
            }

            if (limit < 1) {
                limit = 15;
            }

            if (limit > 15) {
                limit = 15;
            }

            Map<String, Object> result =
                    ngoService.searchLocation(
                            location.trim(),
                            limit
                    );

            return result;

        } catch (Exception e) {

            e.printStackTrace();

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Unable to search location"
            );

            response.put(
                    "ngos",
                    List.of()
            );

            return response;
        }
    }

    /*
     * BACKWARD-COMPATIBLE ENDPOINT
     *
     * Supports:
     *
     * /api/ngos/nearby?latitude=17.4285&longitude=78.5379&limit=15
     *
     * and also:
     *
     * /api/ngos/nearby?location=Tarnaka&limit=15
     */
    @GetMapping("/nearby")
    public List<Map<String, Object>> nearby(
            @RequestParam(required = false)
            Double latitude,

            @RequestParam(required = false)
            Double longitude,

            @RequestParam(required = false)
            String location,

            @RequestParam(defaultValue = "15")
            int limit) {

        try {

            if (limit < 1) {
                limit = 15;
            }

            if (limit > 15) {
                limit = 15;
            }

            if (
                    latitude != null
                    && longitude != null
            ) {

                return ngoService.findNearbyNgos(
                        latitude,
                        longitude,
                        limit
                );
            }

            if (
                    location != null
                    && !location.trim().isEmpty()
            ) {

                Map<String, Object> result =
                        ngoService.searchLocation(
                                location.trim(),
                                limit
                        );

                Object ngos =
                        result.get("ngos");

                if (ngos instanceof List<?>) {

                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> list =
                            (List<Map<String, Object>>) ngos;

                    return list;
                }
            }

            return List.of();

        } catch (Exception e) {

            e.printStackTrace();

            return List.of();
        }
    }
}