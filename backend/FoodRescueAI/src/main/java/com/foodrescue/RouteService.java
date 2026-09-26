package com.foodrescue;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RouteService {

    private static final String NOMINATIM_URL =
            "https://nominatim.openstreetmap.org/search";

    private static final String OSRM_URL =
            "https://router.project-osrm.org/route/v1/driving/";

    private static final String USER_AGENT =
            "FoodRescueAI-RoutePlanner/1.0";

    /*
     * Approximate Hyderabad project boundary.
     * This prevents locations outside Hyderabad from
     * accidentally being accepted.
     */
    private static final double MIN_LATITUDE = 17.15;
    private static final double MAX_LATITUDE = 17.60;
    private static final double MIN_LONGITUDE = 78.25;
    private static final double MAX_LONGITUDE = 78.70;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    /*
     * Cache geocoded locations so repeated searches are fast.
     */
    private final ConcurrentHashMap<String, Map<String, Object>>
            geocodeCache = new ConcurrentHashMap<>();

    /*
     * Nominatim public service should not be hit repeatedly
     * without a small gap.
     */
    private volatile long lastNominatimRequestTime = 0L;

    public RouteService() {

        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();

        this.objectMapper = new ObjectMapper();
    }

    // ============================================================
    // MAIN ROUTE CALCULATION
    // ============================================================

    public Map<String, Object> calculateRoute(
            String pickup,
            String destination) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        if (pickup == null || pickup.trim().isEmpty()) {

            response.put("success", false);
            response.put(
                    "message",
                    "Please enter a pickup location."
            );

            return response;
        }

        if (destination == null
                || destination.trim().isEmpty()) {

            response.put("success", false);
            response.put(
                    "message",
                    "Please enter a destination."
            );

            return response;
        }

        try {

            String cleanPickup =
                    pickup.trim();

            String cleanDestination =
                    destination.trim();

            // ----------------------------------------------------
            // GEOCODE PICKUP
            // ----------------------------------------------------

            Map<String, Object> pickupPoint =
                    geocode(cleanPickup);

            if (pickupPoint == null) {

                response.put("success", false);
                response.put(
                        "message",
                        "Pickup location was not found. Please enter a valid Hyderabad location."
                );

                return response;
            }

            // ----------------------------------------------------
            // GEOCODE DESTINATION
            // ----------------------------------------------------

            Map<String, Object> destinationPoint =
                    geocode(cleanDestination);

            if (destinationPoint == null) {

                response.put("success", false);
                response.put(
                        "message",
                        "Destination was not found. Please enter a valid Hyderabad location."
                );

                return response;
            }

            double pickupLatitude =
                    ((Number) pickupPoint.get("latitude"))
                            .doubleValue();

            double pickupLongitude =
                    ((Number) pickupPoint.get("longitude"))
                            .doubleValue();

            double destinationLatitude =
                    ((Number) destinationPoint.get("latitude"))
                            .doubleValue();

            double destinationLongitude =
                    ((Number) destinationPoint.get("longitude"))
                            .doubleValue();

            // ----------------------------------------------------
            // VALIDATE HYDERABAD
            // ----------------------------------------------------

            if (!isInsideHyderabad(
                    pickupLatitude,
                    pickupLongitude)) {

                response.put("success", false);
                response.put(
                        "message",
                        "Pickup location must be inside Hyderabad."
                );

                return response;
            }

            if (!isInsideHyderabad(
                    destinationLatitude,
                    destinationLongitude)) {

                response.put("success", false);
                response.put(
                        "message",
                        "Destination must be inside Hyderabad."
                );

                return response;
            }

            // ----------------------------------------------------
            // GET ACTUAL ROAD ROUTE
            // ----------------------------------------------------

            Map<String, Object> route =
                    getDrivingRoute(
                            pickupLongitude,
                            pickupLatitude,
                            destinationLongitude,
                            destinationLatitude
                    );

            if (route == null) {

                response.put("success", false);
                response.put(
                        "message",
                        "A driving route could not be calculated for these locations."
                );

                return response;
            }

            // ----------------------------------------------------
            // FINAL RESPONSE
            // ----------------------------------------------------

            response.put("success", true);

            response.put(
                    "message",
                    "Route calculated successfully."
            );

            response.put(
                    "pickup",
                    pickupPoint
            );

            response.put(
                    "destination",
                    destinationPoint
            );

            response.put(
                    "distanceMeters",
                    route.get("distanceMeters")
            );

            response.put(
                    "distance",
                    route.get("distance")
            );

            response.put(
                    "durationSeconds",
                    route.get("durationSeconds")
            );

            response.put(
                    "duration",
                    route.get("duration")
            );

            response.put(
                    "geometry",
                    route.get("geometry")
            );

            return response;

        } catch (Exception e) {

            e.printStackTrace();

            response.put("success", false);
            response.put(
                    "message",
                    "Unable to calculate the route right now."
            );

            return response;
        }
    }

    // ============================================================
    // GEOCODING
    // ============================================================

    private Map<String, Object> geocode(
            String location)
            throws IOException, InterruptedException {

        String cacheKey =
                location.toLowerCase().trim();

        // --------------------------------------------------------
        // CACHE
        // --------------------------------------------------------

        Map<String, Object> cached =
                geocodeCache.get(cacheKey);

        if (cached != null) {

            return new LinkedHashMap<>(cached);
        }

        // --------------------------------------------------------
        // RATE LIMIT GAP
        // --------------------------------------------------------

        waitForNominatim();

        String query =
                location
                        + ", Hyderabad, Telangana, India";

        String encodedQuery =
                URLEncoder.encode(
                        query,
                        StandardCharsets.UTF_8
                );

        String url =
                NOMINATIM_URL
                        + "?q="
                        + encodedQuery
                        + "&format=jsonv2"
                        + "&limit=1"
                        + "&addressdetails=1"
                        + "&countrycodes=in";

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .timeout(Duration.ofSeconds(10))
                        .header(
                                "User-Agent",
                                USER_AGENT
                        )
                        .header(
                                "Accept",
                                "application/json"
                        )
                        .GET()
                        .build();

        lastNominatimRequestTime =
                System.currentTimeMillis();

        HttpResponse<String> httpResponse =
                httpClient.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                );

        if (httpResponse.statusCode() != 200) {

            System.out.println(
                    "Nominatim HTTP status: "
                            + httpResponse.statusCode()
            );

            return null;
        }

        JsonNode root =
                objectMapper.readTree(
                        httpResponse.body()
                );

        if (root == null
                || !root.isArray()
                || root.isEmpty()) {

            return null;
        }

        JsonNode place =
                root.get(0);

        double latitude =
                place.path("lat")
                        .asDouble(Double.NaN);

        double longitude =
                place.path("lon")
                        .asDouble(Double.NaN);

        if (Double.isNaN(latitude)
                || Double.isNaN(longitude)) {

            return null;
        }

        if (!isInsideHyderabad(
                latitude,
                longitude)) {

            return null;
        }

        String displayName =
                place.path("display_name")
                        .asText(location);

        Map<String, Object> point =
                new LinkedHashMap<>();

        point.put(
                "name",
                location
        );

        point.put(
                "displayName",
                displayName
        );

        point.put(
                "latitude",
                latitude
        );

        point.put(
                "longitude",
                longitude
        );

        geocodeCache.put(
                cacheKey,
                point
        );

        return new LinkedHashMap<>(point);
    }

    // ============================================================
    // NOMINATIM RATE LIMIT
    // ============================================================

    private void waitForNominatim()
            throws InterruptedException {

        synchronized (this) {

            long now =
                    System.currentTimeMillis();

            long elapsed =
                    now - lastNominatimRequestTime;

            long minimumGap =
                    1100L;

            if (elapsed < minimumGap) {

                long waitTime =
                        minimumGap - elapsed;

                Thread.sleep(waitTime);
            }

            lastNominatimRequestTime =
                    System.currentTimeMillis();
        }
    }

    // ============================================================
    // OSRM ROUTING
    // ============================================================

    private Map<String, Object> getDrivingRoute(
            double pickupLongitude,
            double pickupLatitude,
            double destinationLongitude,
            double destinationLatitude)
            throws IOException, InterruptedException {

        /*
         * OSRM expects:
         *
         * longitude,latitude;longitude,latitude
         */

        String coordinates =
                pickupLongitude
                        + ","
                        + pickupLatitude
                        + ";"
                        + destinationLongitude
                        + ","
                        + destinationLatitude;

        String url =
                OSRM_URL
                        + coordinates
                        + "?overview=full"
                        + "&geometries=geojson"
                        + "&steps=true";

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .timeout(Duration.ofSeconds(20))
                        .header(
                                "User-Agent",
                                USER_AGENT
                        )
                        .header(
                                "Accept",
                                "application/json"
                        )
                        .GET()
                        .build();

        HttpResponse<String> httpResponse =
                httpClient.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                );

        if (httpResponse.statusCode() != 200) {

            System.out.println(
                    "OSRM HTTP status: "
                            + httpResponse.statusCode()
            );

            return null;
        }

        JsonNode root =
                objectMapper.readTree(
                        httpResponse.body()
                );

        if (root == null) {
            return null;
        }

        String code =
                root.path("code")
                        .asText("");

        if (!"Ok".equalsIgnoreCase(code)) {

            System.out.println(
                    "OSRM returned: "
                            + code
            );

            return null;
        }

        JsonNode routes =
                root.path("routes");

        if (!routes.isArray()
                || routes.isEmpty()) {

            return null;
        }

        JsonNode route =
                routes.get(0);

        double distanceMeters =
                route.path("distance")
                        .asDouble(0);

        double durationSeconds =
                route.path("duration")
                        .asDouble(0);

        JsonNode geometry =
                route.path("geometry");

        if (geometry.isMissingNode()
                || geometry.isNull()) {

            return null;
        }

        Map<String, Object> result =
                new LinkedHashMap<>();

        result.put(
                "distanceMeters",
                distanceMeters
        );

        result.put(
                "distance",
                formatDistance(
                        distanceMeters
                )
        );

        result.put(
                "durationSeconds",
                durationSeconds
        );

        result.put(
                "duration",
                formatDuration(
                        durationSeconds
                )
        );

        result.put(
                "geometry",
                geometry
        );

        return result;
    }

    // ============================================================
    // HYDERABAD VALIDATION
    // ============================================================

    private boolean isInsideHyderabad(
            double latitude,
            double longitude) {

        return latitude >= MIN_LATITUDE
                && latitude <= MAX_LATITUDE
                && longitude >= MIN_LONGITUDE
                && longitude <= MAX_LONGITUDE;
    }

    // ============================================================
    // DISTANCE FORMAT
    // ============================================================

    private String formatDistance(
            double meters) {

        if (meters < 1000) {

            return Math.round(meters)
                    + " m";
        }

        return String.format(
                "%.2f km",
                meters / 1000.0
        );
    }

    // ============================================================
    // TIME FORMAT
    // ============================================================

    private String formatDuration(
            double seconds) {

        long minutes =
                Math.round(
                        seconds / 60.0
                );

        if (minutes < 1) {

            return "Less than 1 min";
        }

        long hours =
                minutes / 60;

        long remainingMinutes =
                minutes % 60;

        if (hours > 0) {

            if (remainingMinutes > 0) {

                return hours
                        + " hr "
                        + remainingMinutes
                        + " min";
            }

            return hours + " hr";
        }

        return minutes + " min";
    }
}