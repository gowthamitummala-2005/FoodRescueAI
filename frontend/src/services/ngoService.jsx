const BASE_URL = "http://foodrescueai-backend.onrender.com/api";

// Find NGOs for ANY location entered by the user
export async function findNearbyNgos(location) {

    if (!location || !location.trim()) {
        throw new Error("Please enter a location");
    }

    const response = await fetch(
        `${BASE_URL}/ngos/nearby?location=${encodeURIComponent(
            location.trim()
        )}`
    );

    if (!response.ok) {
        let message = "Unable to find nearby NGOs";

        try {
            const errorData = await response.json();

            if (errorData?.error) {
                message = errorData.error;
            }
        } catch (error) {
            // Keep default message
        }

        throw new Error(message);
    }

    return await response.json();
}


// Get NGO search history
export async function getNgoSearchHistory() {

    const response = await fetch(
        `${BASE_URL}/ngo-history`
    );

    if (!response.ok) {
        throw new Error("Unable to load NGO search history");
    }

    return await response.json();
}


// Complete NGO search
export async function searchNgos(location) {

    if (!location || !location.trim()) {
        throw new Error("Please enter a location");
    }

    const cleanLocation = location.trim();

    const ngos = await findNearbyNgos(cleanLocation);

    return {
        searchedLocation: cleanLocation,
        ngos: Array.isArray(ngos) ? ngos : []
    };
}