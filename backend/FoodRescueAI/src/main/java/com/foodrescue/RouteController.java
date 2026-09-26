package com.foodrescue;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "https://foodrescueai.netlify.app")
public class RouteController {

    private final RouteService routeService;

    public RouteController(
            RouteService routeService) {

        this.routeService =
                routeService;
    }

    @GetMapping("/calculate")
    public Map<String, Object> calculateRoute(
            @RequestParam("pickup") String pickup,
            @RequestParam("destination") String destination) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        try {

            if (pickup == null
                    || pickup.trim().isEmpty()) {

                response.put(
                        "success",
                        false
                );

                response.put(
                        "message",
                        "Please enter a pickup location."
                );

                return response;
            }

            if (destination == null
                    || destination.trim().isEmpty()) {

                response.put(
                        "success",
                        false
                );

                response.put(
                        "message",
                        "Please enter a destination."
                );

                return response;
            }

            return routeService.calculateRoute(
                    pickup.trim(),
                    destination.trim()
            );

        } catch (Exception e) {

            e.printStackTrace();

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Unable to calculate the route."
            );

            return response;
        }
    }
}