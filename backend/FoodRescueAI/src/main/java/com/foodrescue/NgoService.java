package com.foodrescue;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class NgoService {

    // ============================================================
    // CONFIGURATION
    // ============================================================

    private static final double SEARCH_RADIUS_METERS = 5000.0;

    private static final int DEFAULT_LIMIT = 15;
    private static final int MAX_LIMIT = 15;

    private static final String NOMINATIM_SEARCH_URL =
            "https://nominatim.openstreetmap.org/search";

    private static final String OVERPASS_URL =
            "https://overpass-api.de/api/interpreter";

    private static final String USER_AGENT =
            "FoodRescueAI-NGO-Finder/1.0";

    // ============================================================
    // HTTP + JSON
    // ============================================================

    private final HttpClient httpClient;

    private final ObjectMapper objectMapper;

    // ============================================================
    // CACHE
    // ============================================================

    private final ConcurrentHashMap<String, GeoPoint> locationCache =
            new ConcurrentHashMap<>();

    private final ConcurrentHashMap<String, CachedNgoResult> ngoCache =
            new ConcurrentHashMap<>();

    private static final long CACHE_TIME_MILLIS = 120_000L;

    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public NgoService() {

        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();

        this.objectMapper = new ObjectMapper();
    }

    // ============================================================
    // MAIN LOCATION SEARCH
    // ============================================================

    public Map<String, Object> searchLocation(
            String location,
            int limit) {

        Map<String, Object> result = new LinkedHashMap<>();

        if (location == null || location.trim().isEmpty()) {

            result.put("success", false);
            result.put("message", "Please enter a location");
            result.put("ngos", List.of());

            return result;
        }

        limit = normalizeLimit(limit);

        String cleanLocation = location.trim();

        try {

            // ----------------------------------------------------
            // 1. GEOCODE LOCATION
            // ----------------------------------------------------

            GeoPoint point = geocodeLocation(cleanLocation);

            if (point == null) {

                result.put("success", false);
                result.put(
                        "message",
                        "Location could not be found. Please enter a valid Hyderabad location."
                );
                result.put("ngos", List.of());

                return result;
            }

            // ----------------------------------------------------
            // 2. FIND NEARBY NGOs
            // ----------------------------------------------------

            List<Map<String, Object>> ngos =
                    findNearbyNgos(
                            point.latitude,
                            point.longitude,
                            limit
                    );

            // ----------------------------------------------------
            // 3. RESPONSE
            // ----------------------------------------------------

            result.put("success", true);
            result.put("message", ngos.isEmpty()
                    ? "Location found, but no nearby organizations were found."
                    : "Location and nearby organizations found.");

            result.put("location", cleanLocation);
            result.put("latitude", point.latitude);
            result.put("longitude", point.longitude);
            result.put("ngos", ngos);

            return result;

        } catch (Exception e) {

            e.printStackTrace();

            result.put("success", false);
            result.put(
                    "message",
                    "Unable to search location right now."
            );
            result.put("ngos", List.of());

            return result;
        }
    }

    // ============================================================
    // FIND NEARBY NGOs
    // ============================================================

    public List<Map<String, Object>> findNearbyNgos(
            Double latitude,
            Double longitude,
            int limit) {

        limit = normalizeLimit(limit);

        if (latitude == null || longitude == null) {
            return List.of();
        }

        if (!isValidCoordinate(latitude, longitude)) {
            return List.of();
        }

        String cacheKey =
                String.format(
                        "%.4f,%.4f,%d",
                        latitude,
                        longitude,
                        limit
                );

        // --------------------------------------------------------
        // CHECK CACHE
        // --------------------------------------------------------

        CachedNgoResult cached = ngoCache.get(cacheKey);

        if (cached != null && !cached.isExpired()) {

            return new ArrayList<>(cached.results);
        }

        List<Map<String, Object>> results = new ArrayList<>();

        // --------------------------------------------------------
        // FIRST: NOMINATIM
        // --------------------------------------------------------

        try {

            results = searchNominatimNearby(
                    latitude,
                    longitude,
                    limit
            );

        } catch (Exception e) {

            System.out.println(
                    "Nominatim NGO search failed: "
                            + e.getMessage()
            );
        }

        // --------------------------------------------------------
        // FALLBACK: OVERPASS
        // --------------------------------------------------------

        if (results.isEmpty()) {

            try {

                results = searchOverpass(
                        latitude,
                        longitude,
                        limit
                );

            } catch (Exception e) {

                System.out.println(
                        "Overpass NGO search failed: "
                                + e.getMessage()
                );
            }
        }

        // --------------------------------------------------------
        // SORT BY DISTANCE
        // --------------------------------------------------------

        results.sort(
                Comparator.comparingDouble(
                        item -> {

                            Object value =
                                    item.get("distanceMeters");

                            if (value instanceof Number) {
                                return ((Number) value).doubleValue();
                            }

                            return Double.MAX_VALUE;
                        }
                )
        );

        // --------------------------------------------------------
        // LIMIT RESULTS
        // --------------------------------------------------------

        if (results.size() > limit) {

            results =
                    new ArrayList<>(
                            results.subList(0, limit)
                    );
        }

        // --------------------------------------------------------
        // SAVE CACHE
        // --------------------------------------------------------

        ngoCache.put(
                cacheKey,
                new CachedNgoResult(results)
        );

        return results;
    }

    // ============================================================
    // GEOCODING USING NOMINATIM
    // ============================================================

    private GeoPoint geocodeLocation(
            String location)
            throws IOException, InterruptedException {

        String cacheKey =
                location.toLowerCase().trim();

        GeoPoint cached =
                locationCache.get(cacheKey);

        if (cached != null) {
            return cached;
        }

        String query =
                location
                        + ", Hyderabad, Telangana, India";

        String encodedQuery =
                URLEncoder.encode(
                        query,
                        StandardCharsets.UTF_8
                );

        String url =
                NOMINATIM_SEARCH_URL
                        + "?q="
                        + encodedQuery
                        + "&format=jsonv2"
                        + "&limit=1"
                        + "&addressdetails=1"
                        + "&countrycodes=in";

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .timeout(Duration.ofSeconds(7))
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

        HttpResponse<String> response =
                httpClient.send(
                        request,
                        HttpResponse.BodyHandlers.ofString()
                );

        if (response.statusCode() != 200) {

            System.out.println(
                    "Nominatim geocoding HTTP status: "
                            + response.statusCode()
            );

            return null;
        }

        JsonNode root =
                objectMapper.readTree(
                        response.body()
                );

        if (root == null
                || !root.isArray()
                || root.isEmpty()) {

            return null;
        }

        JsonNode first =
                root.get(0);

        if (first == null) {
            return null;
        }

        double latitude =
                first.path("lat")
                        .asDouble(Double.NaN);

        double longitude =
                first.path("lon")
                        .asDouble(Double.NaN);

        if (Double.isNaN(latitude)
                || Double.isNaN(longitude)) {

            return null;
        }

        GeoPoint point =
                new GeoPoint(
                        latitude,
                        longitude
                );

        locationCache.put(
                cacheKey,
                point
        );

        return point;
    }

    // ============================================================
    // NOMINATIM NEARBY SEARCH
    // ============================================================

    private List<Map<String, Object>> searchNominatimNearby(
            double latitude,
            double longitude,
            int limit)
            throws IOException, InterruptedException {

        List<Map<String, Object>> results =
                new ArrayList<>();

        /*
         * Approximately 5 km search box.
         */
        double latDelta = 0.055;
        double lonDelta = 0.055;

        double left = longitude - lonDelta;
        double right = longitude + lonDelta;
        double top = latitude + latDelta;
        double bottom = latitude - latDelta;

        String viewBox =
                left + ","
                        + top + ","
                        + right + ","
                        + bottom;

        /*
         * Search several useful OSM organization categories.
         *
         * Nominatim may return fewer results than Overpass because
         * Nominatim is primarily a geocoder/search service.
         */
        String[] searchTerms = {
                "NGO",
                "charity",
                "foundation",
                "social centre",
                "community centre"
        };

        for (String searchTerm : searchTerms) {

            if (results.size() >= limit) {
                break;
            }

            String url =
                    NOMINATIM_SEARCH_URL
                            + "?q="
                            + URLEncoder.encode(
                                    searchTerm
                                            + ", Hyderabad, Telangana, India",
                                    StandardCharsets.UTF_8
                            )
                            + "&format=jsonv2"
                            + "&limit=10"
                            + "&addressdetails=1"
                            + "&extratags=1"
                            + "&countrycodes=in"
                            + "&viewbox="
                            + URLEncoder.encode(
                                    viewBox,
                                    StandardCharsets.UTF_8
                            )
                            + "&bounded=1";

            HttpRequest request =
                    HttpRequest.newBuilder()
                            .uri(URI.create(url))
                            .timeout(Duration.ofSeconds(6))
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

            HttpResponse<String> response;

            try {

                response =
                        httpClient.send(
                                request,
                                HttpResponse.BodyHandlers.ofString()
                        );

            } catch (IOException e) {

                System.out.println(
                        "Nominatim request failed: "
                                + e.getMessage()
                );

                continue;

            } catch (InterruptedException e) {

                Thread.currentThread().interrupt();

                System.out.println(
                        "Nominatim request interrupted."
                );

                break;
            }

            if (response.statusCode() != 200) {
                continue;
            }

            JsonNode root;

            try {

                root =
                        objectMapper.readTree(
                                response.body()
                        );

            } catch (Exception e) {

                continue;
            }

            if (root == null
                    || !root.isArray()) {

                continue;
            }

            for (JsonNode node : root) {

                Map<String, Object> ngo =
                        convertNominatimResult(
                                node,
                                latitude,
                                longitude
                        );

                if (ngo == null) {
                    continue;
                }

                if (!containsSameLocation(
                        results,
                        ngo)) {

                    results.add(ngo);
                }

                if (results.size() >= limit) {
                    break;
                }
            }
        }

        return results;
    }

    // ============================================================
    // OVERPASS FALLBACK
    // ============================================================

    private List<Map<String, Object>> searchOverpass(
            double latitude,
            double longitude,
            int limit)
            throws IOException, InterruptedException {

        List<Map<String, Object>> results =
                new ArrayList<>();

        /*
         * One combined query instead of many separate requests.
         * This is faster and reduces timeout problems.
         */
        String query =
                "[out:json][timeout:7];"
                        + "("

                        + "nwr(around:"
                        + (int) SEARCH_RADIUS_METERS
                        + ","
                        + latitude
                        + ","
                        + longitude
                        + ")[office=ngo];"

                        + "nwr(around:"
                        + (int) SEARCH_RADIUS_METERS
                        + ","
                        + latitude
                        + ","
                        + longitude
                        + ")[office=charity];"

                        + "nwr(around:"
                        + (int) SEARCH_RADIUS_METERS
                        + ","
                        + latitude
                        + ","
                        + longitude
                        + ")[office=foundation];"

                        + "nwr(around:"
                        + (int) SEARCH_RADIUS_METERS
                        + ","
                        + latitude
                        + ","
                        + longitude
                        + ")[office=association];"

                        + "nwr(around:"
                        + (int) SEARCH_RADIUS_METERS
                        + ","
                        + latitude
                        + ","
                        + longitude
                        + ")[amenity=social_facility];"

                        + "nwr(around:"
                        + (int) SEARCH_RADIUS_METERS
                        + ","
                        + latitude
                        + ","
                        + longitude
                        + ")[amenity=social_centre];"

                        + "nwr(around:"
                        + (int) SEARCH_RADIUS_METERS
                        + ","
                        + latitude
                        + ","
                        + longitude
                        + ")[amenity=community_centre];"

                        + "nwr(around:"
                        + (int) SEARCH_RADIUS_METERS
                        + ","
                        + latitude
                        + ","
                        + longitude
                        + ")[shop=charity];"

                        + ");"
                        + "out center tags;";

        String encodedQuery =
                URLEncoder.encode(
                        query,
                        StandardCharsets.UTF_8
                );

        String url =
                OVERPASS_URL
                        + "?data="
                        + encodedQuery;

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .timeout(Duration.ofSeconds(9))
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

        HttpResponse<String> response;

        try {

            response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

        } catch (IOException e) {

            System.out.println(
                    "Overpass connection error: "
                            + e.getMessage()
            );

            return results;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            System.out.println(
                    "Overpass request interrupted."
            );

            return results;
        }

        if (response.statusCode() != 200) {

            System.out.println(
                    "Overpass HTTP status: "
                            + response.statusCode()
            );

            return results;
        }

        JsonNode root;

        try {

            root =
                    objectMapper.readTree(
                            response.body()
                    );

        } catch (Exception e) {

            System.out.println(
                    "Could not parse Overpass response: "
                            + e.getMessage()
            );

            return results;
        }

        if (root == null) {
            return results;
        }

        JsonNode elements =
                root.path("elements");

        if (!elements.isArray()) {
            return results;
        }

        for (JsonNode node : elements) {

            Map<String, Object> ngo =
                    convertOverpassResult(
                            node,
                            latitude,
                            longitude
                    );

            if (ngo == null) {
                continue;
            }

            if (!containsSameLocation(
                    results,
                    ngo)) {

                results.add(ngo);
            }

            if (results.size() >= limit) {
                break;
            }
        }

        return results;
    }

    // ============================================================
    // CONVERT NOMINATIM RESULT
    // ============================================================

    private Map<String, Object> convertNominatimResult(
            JsonNode node,
            double searchLatitude,
            double searchLongitude) {

        try {

            double latitude =
                    node.path("lat")
                            .asDouble(Double.NaN);

            double longitude =
                    node.path("lon")
                            .asDouble(Double.NaN);

            if (Double.isNaN(latitude)
                    || Double.isNaN(longitude)) {

                return null;
            }

            double distanceMeters =
                    calculateDistanceMeters(
                            searchLatitude,
                            searchLongitude,
                            latitude,
                            longitude
                    );

            if (distanceMeters > SEARCH_RADIUS_METERS) {
                return null;
            }

            JsonNode address =
                    node.path("address");

            JsonNode extratags =
                    node.path("extratags");

            String name =
                    getText(
                            node,
                            "name"
                    );

            if (isBlank(name)) {

                name =
                        getText(
                                node,
                                "display_name"
                        );
            }

            if (isBlank(name)) {
                name = "Nearby Organization";
            }

            String phone =
                    firstNonBlank(
                            getText(node, "phone"),
                            getText(node, "contact:phone"),
                            getText(extratags, "phone"),
                            getText(extratags, "contact:phone")
                    );

            String website =
                    firstNonBlank(
                            getText(node, "website"),
                            getText(node, "contact:website"),
                            getText(extratags, "website"),
                            getText(extratags, "contact:website")
                    );

            String openingHours =
                    firstNonBlank(
                            getText(node, "opening_hours"),
                            getText(extratags, "opening_hours")
                    );

            String type =
                    firstNonBlank(
                            getText(node, "type"),
                            getText(node, "category"),
                            "Organization"
                    );

            String displayAddress =
                    getText(
                            node,
                            "display_name"
                    );

            if (isBlank(displayAddress)) {

                displayAddress =
                        buildAddress(address);
            }

            Map<String, Object> result =
                    new LinkedHashMap<>();

            result.put("name", name);
            result.put(
                    "address",
                    emptyIfBlank(displayAddress)
            );

            result.put(
                    "latitude",
                    latitude
            );

            result.put(
                    "longitude",
                    longitude
            );

            result.put(
                    "distanceMeters",
                    distanceMeters
            );

            result.put(
                    "distance",
                    formatDistance(distanceMeters)
            );

            result.put(
                    "phone",
                    emptyIfBlank(phone)
            );

            result.put(
                    "website",
                    emptyIfBlank(website)
            );

            result.put(
                    "openingHours",
                    emptyIfBlank(openingHours)
            );

            result.put(
                    "type",
                    type
            );

            String osmType =
                    getText(
                            node,
                            "osm_type"
                    );

            String osmId =
                    getText(
                            node,
                            "osm_id"
                    );

            String placeId =
                    firstNonBlank(
                            getText(node, "place_id"),
                            osmType + "-" + osmId
                    );

            result.put(
                    "placeId",
                    placeId
            );

            return result;

        } catch (Exception e) {

            System.out.println(
                    "Error converting Nominatim result: "
                            + e.getMessage()
            );

            return null;
        }
    }

    // ============================================================
    // CONVERT OVERPASS RESULT
    // ============================================================

    private Map<String, Object> convertOverpassResult(
            JsonNode node,
            double searchLatitude,
            double searchLongitude) {

        try {

            double latitude;
            double longitude;

            /*
             * Nodes have lat/lon directly.
             * Ways/relations usually have a center object.
             */
            if (node.has("lat")
                    && node.has("lon")) {

                latitude =
                        node.path("lat")
                                .asDouble(Double.NaN);

                longitude =
                        node.path("lon")
                                .asDouble(Double.NaN);

            } else {

                JsonNode center =
                        node.path("center");

                latitude =
                        center.path("lat")
                                .asDouble(Double.NaN);

                longitude =
                        center.path("lon")
                                .asDouble(Double.NaN);
            }

            if (Double.isNaN(latitude)
                    || Double.isNaN(longitude)) {

                return null;
            }

            double distanceMeters =
                    calculateDistanceMeters(
                            searchLatitude,
                            searchLongitude,
                            latitude,
                            longitude
                    );

            if (distanceMeters > SEARCH_RADIUS_METERS) {
                return null;
            }

            JsonNode tags =
                    node.path("tags");

            String name =
                    getText(
                            tags,
                            "name"
                    );

            if (isBlank(name)) {
                name = "Nearby Organization";
            }

            String address =
                    buildOverpassAddress(tags);

            String phone =
                    firstNonBlank(
                            getText(tags, "phone"),
                            getText(tags, "contact:phone")
                    );

            String website =
                    firstNonBlank(
                            getText(tags, "website"),
                            getText(tags, "contact:website")
                    );

            String openingHours =
                    getText(
                            tags,
                            "opening_hours"
                    );

            String type =
                    firstNonBlank(
                            getText(tags, "office"),
                            getText(tags, "amenity"),
                            getText(tags, "shop"),
                            "Organization"
                    );

            String elementType =
                    getText(
                            node,
                            "type"
                    );

            String elementId =
                    getText(
                            node,
                            "id"
                    );

            Map<String, Object> result =
                    new LinkedHashMap<>();

            result.put(
                    "name",
                    name
            );

            result.put(
                    "address",
                    emptyIfBlank(address)
            );

            result.put(
                    "latitude",
                    latitude
            );

            result.put(
                    "longitude",
                    longitude
            );

            result.put(
                    "distanceMeters",
                    distanceMeters
            );

            result.put(
                    "distance",
                    formatDistance(distanceMeters)
            );

            result.put(
                    "phone",
                    emptyIfBlank(phone)
            );

            result.put(
                    "website",
                    emptyIfBlank(website)
            );

            result.put(
                    "openingHours",
                    emptyIfBlank(openingHours)
            );

            result.put(
                    "type",
                    type
            );

            result.put(
                    "placeId",
                    elementType
                            + "-"
                            + elementId
            );

            return result;

        } catch (Exception e) {

            System.out.println(
                    "Error converting Overpass result: "
                            + e.getMessage()
            );

            return null;
        }
    }

    // ============================================================
    // ADDRESS FROM NOMINATIM
    // ============================================================

    private String buildAddress(
            JsonNode address) {

        if (address == null
                || address.isMissingNode()
                || address.isNull()) {

            return "";
        }

        List<String> parts =
                new ArrayList<>();

        addIfPresent(
                parts,
                address,
                "road"
        );

        addIfPresent(
                parts,
                address,
                "suburb"
        );

        addIfPresent(
                parts,
                address,
                "neighbourhood"
        );

        addIfPresent(
                parts,
                address,
                "city_district"
        );

        addIfPresent(
                parts,
                address,
                "city"
        );

        addIfPresent(
                parts,
                address,
                "town"
        );

        addIfPresent(
                parts,
                address,
                "postcode"
        );

        return String.join(
                ", ",
                parts
        );
    }

    // ============================================================
    // ADDRESS FROM OVERPASS
    // ============================================================

    private String buildOverpassAddress(
            JsonNode tags) {

        if (tags == null
                || tags.isMissingNode()
                || tags.isNull()) {

            return "";
        }

        List<String> parts =
                new ArrayList<>();

        addTagIfPresent(
                parts,
                tags,
                "addr:housenumber"
        );

        addTagIfPresent(
                parts,
                tags,
                "addr:street"
        );

        addTagIfPresent(
                parts,
                tags,
                "addr:suburb"
        );

        addTagIfPresent(
                parts,
                tags,
                "addr:city"
        );

        addTagIfPresent(
                parts,
                tags,
                "addr:postcode"
        );

        return String.join(
                ", ",
                parts
        );
    }

    // ============================================================
    // DUPLICATE CHECK
    // ============================================================

    private boolean containsSameLocation(
            List<Map<String, Object>> results,
            Map<String, Object> candidate) {

        Object candidateLat =
                candidate.get("latitude");

        Object candidateLon =
                candidate.get("longitude");

        if (!(candidateLat instanceof Number)
                || !(candidateLon instanceof Number)) {

            return false;
        }

        double lat =
                ((Number) candidateLat).doubleValue();

        double lon =
                ((Number) candidateLon).doubleValue();

        String candidateName =
                String.valueOf(
                        candidate.getOrDefault(
                                "name",
                                ""
                        )
                );

        for (Map<String, Object> existing : results) {

            Object existingLat =
                    existing.get("latitude");

            Object existingLon =
                    existing.get("longitude");

            if (!(existingLat instanceof Number)
                    || !(existingLon instanceof Number)) {

                continue;
            }

            double lat2 =
                    ((Number) existingLat)
                            .doubleValue();

            double lon2 =
                    ((Number) existingLon)
                            .doubleValue();

            String existingName =
                    String.valueOf(
                            existing.getOrDefault(
                                    "name",
                                    ""
                            )
                    );

            boolean sameCoordinates =
                    Math.abs(lat - lat2) < 0.0001
                            && Math.abs(lon - lon2) < 0.0001;

            boolean sameName =
                    !isBlank(candidateName)
                            && candidateName.equalsIgnoreCase(
                                    existingName
                            );

            if (sameCoordinates || sameName) {
                return true;
            }
        }

        return false;
    }

    // ============================================================
    // DISTANCE CALCULATION
    // ============================================================

    private double calculateDistanceMeters(
            double lat1,
            double lon1,
            double lat2,
            double lon2) {

        final double earthRadius =
                6_371_000.0;

        double lat1Radians =
                Math.toRadians(lat1);

        double lat2Radians =
                Math.toRadians(lat2);

        double deltaLat =
                Math.toRadians(
                        lat2 - lat1
                );

        double deltaLon =
                Math.toRadians(
                        lon2 - lon1
                );

        double a =
                Math.sin(deltaLat / 2)
                        * Math.sin(deltaLat / 2)
                        + Math.cos(lat1Radians)
                        * Math.cos(lat2Radians)
                        * Math.sin(deltaLon / 2)
                        * Math.sin(deltaLon / 2);

        double c =
                2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a)
                );

        return earthRadius * c;
    }

    // ============================================================
    // FORMAT DISTANCE
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
    // JSON TEXT HELPER
    // ============================================================

    private String getText(
            JsonNode node,
            String field) {

        if (node == null
                || node.isMissingNode()
                || node.isNull()) {

            return "";
        }

        JsonNode value =
                node.get(field);

        if (value == null
                || value.isNull()) {

            return "";
        }

        return value.asText("").trim();
    }

    // ============================================================
    // ADD ADDRESS FIELD
    // ============================================================

    private void addIfPresent(
            List<String> parts,
            JsonNode node,
            String field) {

        String value =
                getText(
                        node,
                        field
                );

        if (!value.isEmpty()
                && !parts.contains(value)) {

            parts.add(value);
        }
    }

    // ============================================================
    // ADD OVERPASS TAG
    // ============================================================

    private void addTagIfPresent(
            List<String> parts,
            JsonNode tags,
            String field) {

        String value =
                getText(
                        tags,
                        field
                );

        if (!value.isEmpty()
                && !parts.contains(value)) {

            parts.add(value);
        }
    }

    // ============================================================
    // FIRST NON-BLANK
    // ============================================================

    private String firstNonBlank(
            String... values) {

        if (values == null) {
            return "";
        }

        for (String value : values) {

            if (value != null
                    && !value.trim().isEmpty()) {

                return value.trim();
            }
        }

        return "";
    }

    // ============================================================
    // BLANK CHECK
    // ============================================================

    private boolean isBlank(
            String value) {

        return value == null
                || value.trim().isEmpty();
    }

    // ============================================================
    // EMPTY STRING
    // ============================================================

    private String emptyIfBlank(
            String value) {

        return value == null
                ? ""
                : value.trim();
    }

    // ============================================================
    // LIMIT
    // ============================================================

    private int normalizeLimit(
            int limit) {

        if (limit < 1) {
            return DEFAULT_LIMIT;
        }

        return Math.min(
                limit,
                MAX_LIMIT
        );
    }

    // ============================================================
    // COORDINATE VALIDATION
    // ============================================================

    private boolean isValidCoordinate(
            double latitude,
            double longitude) {

        return latitude >= -90
                && latitude <= 90
                && longitude >= -180
                && longitude <= 180;
    }

    // ============================================================
    // GEO POINT CLASS
    // ============================================================

    private static class GeoPoint {

        private final double latitude;
        private final double longitude;

        private GeoPoint(
                double latitude,
                double longitude) {

            this.latitude = latitude;
            this.longitude = longitude;
        }
    }

    // ============================================================
    // CACHE CLASS
    // ============================================================

    private static class CachedNgoResult {

        private final List<Map<String, Object>> results;
        private final long createdAt;

        private CachedNgoResult(
                List<Map<String, Object>> results) {

            this.results =
                    new ArrayList<>(results);

            this.createdAt =
                    System.currentTimeMillis();
        }

        private boolean isExpired() {

            return System.currentTimeMillis()
                    - createdAt
                    > CACHE_TIME_MILLIS;
        }
    }
}