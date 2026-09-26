import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import axios from "axios";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    CircleMarker,
    Polyline,
    useMap
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


/*
============================================================
API
============================================================
*/

const API_BASE =
    "https://foodrescueai-backend.onrender.com/api/ngos";


/*
============================================================
DEFAULT HYDERABAD LOCATION
============================================================
*/

const HYDERABAD_CENTER = [
    17.3850,
    78.4867
];


/*
============================================================
BLUE SEARCH MARKER
============================================================
*/

const blueIcon =
    L.divIcon({
        className: "custom-blue-marker",
        html: `
            <div style="
                width:32px;
                height:32px;
                background:#1683d8;
                border:4px solid white;
                border-radius:50% 50% 50% 0;
                transform:rotate(-45deg);
                box-shadow:0 3px 10px rgba(0,0,0,0.35);
                position:relative;
            ">
                <div style="
                    width:9px;
                    height:9px;
                    background:white;
                    border-radius:50%;
                    position:absolute;
                    top:8px;
                    left:8px;
                "></div>
            </div>
        `,
        iconSize: [
            32,
            32
        ],
        iconAnchor: [
            16,
            32
        ],
        popupAnchor: [
            0,
            -32
        ]
    });


/*
============================================================
RED NGO MARKER
============================================================
*/

const redIcon =
    L.divIcon({
        className: "custom-red-marker",
        html: `
            <div style="
                width:24px;
                height:24px;
                background:#e53935;
                border:3px solid white;
                border-radius:50%;
                box-shadow:0 2px 8px rgba(0,0,0,0.4);
                position:relative;
            ">
                <div style="
                    width:7px;
                    height:7px;
                    background:white;
                    border-radius:50%;
                    position:absolute;
                    top:6px;
                    left:6px;
                "></div>
            </div>
        `,
        iconSize: [
            24,
            24
        ],
        iconAnchor: [
            12,
            12
        ],
        popupAnchor: [
            0,
            -12
        ]
    });


/*
============================================================
MAP VIEW CHANGER
============================================================
*/

function MapUpdater({
    center,
    zoom
}) {

    const map =
        useMap();

    useEffect(() => {

        if (!center) {
            return;
        }

        map.flyTo(
            center,
            zoom,
            {
                duration: 0.8
            }
        );

    }, [
        center,
        zoom,
        map
    ]);

    return null;
}


/*
============================================================
MAIN NGO PAGE
============================================================
*/

function NGO() {

    const [
        location,
        setLocation
    ] = useState("");

    const [
        searchedLocation,
        setSearchedLocation
    ] = useState("");

    const [
        center,
        setCenter
    ] = useState(
        HYDERABAD_CENTER
    );

    const [
        ngos,
        setNgos
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");

    const [
        message,
        setMessage
    ] = useState("");

    const [
        selectedNgo,
        setSelectedNgo
    ] = useState(null);

    const [
        route,
        setRoute
    ] = useState([]);

    const [
        routeLoading,
        setRouteLoading
    ] = useState(false);

    const [
        routeInfo,
        setRouteInfo
    ] = useState(null);


    /*
    ========================================================
    SEARCH
    ========================================================
    */

    const searchLocation =
        async () => {

            const value =
                location.trim();

            if (!value) {

                setError(
                    "Please enter a location."
                );

                return;
            }

            setLoading(true);

            setError("");

            setMessage("");

            setNgos([]);

            setRoute([]);

            setRouteInfo(null);

            setSelectedNgo(null);

            try {

                /*
                 * IMPORTANT:
                 *
                 * We call the new backend /search endpoint.
                 *
                 * We do NOT call Google.
                 *
                 * We do NOT call Nominatim from the browser.
                 */

                const response =
                    await axios.get(
                        `${API_BASE}/search`,
                        {
                            params: {
                                location:
                                    value,
                                limit:
                                    15
                            },

                            /*
                             * Increased slightly so that
                             * a slow OSM response does not
                             * immediately produce the old
                             * 12000ms error.
                             */

                            timeout:
                                20000
                        }
                    );


                const data =
                    response.data;


                /*
                 * Backend returns:
                 *
                 * {
                 *   success,
                 *   location,
                 *   latitude,
                 *   longitude,
                 *   ngos
                 * }
                 */

                if (
                    !data
                    || !data.success
                    || data.latitude === undefined
                    || data.longitude === undefined
                ) {

                    setError(
                        data?.message
                        ||
                        "Location could not be found."
                    );

                    setSearchedLocation(
                        value
                    );

                    return;
                }


                const searchedCenter = [
                    Number(
                        data.latitude
                    ),
                    Number(
                        data.longitude
                    )
                ];


                setCenter(
                    searchedCenter
                );


                setSearchedLocation(
                    data.location
                    ||
                    value
                );


                const organizations =
                    Array.isArray(
                        data.ngos
                    )
                        ? data.ngos
                        : [];


                setNgos(
                    organizations
                );


                if (
                    organizations.length === 0
                ) {

                    setMessage(
                        "Location found, but no mapped NGO or organization was found within 5 km."
                    );

                } else {

                    setMessage(
                        `${organizations.length} nearby organization${
                            organizations.length === 1
                                ? ""
                                : "s"
                        } found`
                    );
                }

            } catch (err) {

                console.error(
                    "NGO SEARCH ERROR:",
                    err
                );


                if (
                    err.code ===
                    "ECONNABORTED"
                ) {

                    setError(
                        "The search is taking too long. Please try again."
                    );

                } else if (
                    err.response
                    && err.response.data
                    && err.response.data.message
                ) {

                    setError(
                        err.response.data.message
                    );

                } else {

                    setError(
                        "Unable to load nearby NGO data. Make sure Spring Boot is running on port 8080."
                    );
                }

            } finally {

                setLoading(false);
            }
        };


    /*
    ========================================================
    ENTER KEY
    ========================================================
    */

    const handleKeyDown =
        (event) => {

            if (
                event.key === "Enter"
            ) {

                searchLocation();
            }
        };


    /*
    ========================================================
    DIRECTIONS
    ========================================================
    */

    const getDirections =
        async (ngo) => {

            if (
                !ngo
                || ngo.latitude === undefined
                || ngo.longitude === undefined
            ) {

                return;
            }

            setSelectedNgo(
                ngo
            );

            setRouteLoading(
                true
            );

            setRoute([]);

            setRouteInfo(
                null
            );

            try {

                const startLat =
                    center[0];

                const startLng =
                    center[1];

                const endLat =
                    Number(
                        ngo.latitude
                    );

                const endLng =
                    Number(
                        ngo.longitude
                    );


                /*
                 * OSRM coordinates are:
                 *
                 * longitude,latitude
                 */

                const url =
                    `https://router.project-osrm.org/route/v1/driving/` +
                    `${startLng},${startLat};` +
                    `${endLng},${endLat}` +
                    `?overview=full&geometries=geojson`;


                const response =
                    await axios.get(
                        url,
                        {
                            timeout:
                                10000
                        }
                    );


                if (
                    response.data
                    && response.data.code ===
                    "Ok"
                    && response.data.routes
                    && response.data.routes.length > 0
                ) {

                    const firstRoute =
                        response.data.routes[0];


                    const coordinates =
                        firstRoute
                            .geometry
                            .coordinates
                            .map(
                                (coordinate) => [
                                    coordinate[1],
                                    coordinate[0]
                                ]
                            );


                    setRoute(
                        coordinates
                    );


                    setRouteInfo({
                        distance:
                            formatRouteDistance(
                                firstRoute.distance
                            ),

                        duration:
                            formatRouteDuration(
                                firstRoute.duration
                            )
                    });

                } else {

                    setError(
                        "Directions could not be loaded."
                    );
                }

            } catch (err) {

                console.error(
                    "DIRECTIONS ERROR:",
                    err
                );

                setError(
                    "Unable to load the route right now."
                );

            } finally {

                setRouteLoading(
                    false
                );
            }
        };


    /*
    ========================================================
    ROUTE DISTANCE
    ========================================================
    */

    const formatRouteDistance =
        (meters) => {

            if (
                meters < 1000
            ) {

                return `${Math.round(
                    meters
                )} m`;
            }

            return `${(
                meters / 1000
            ).toFixed(1)} km`;
        };


    /*
    ========================================================
    ROUTE TIME
    ========================================================
    */

    const formatRouteDuration =
        (seconds) => {

            const minutes =
                Math.round(
                    seconds / 60
                );

            if (
                minutes < 60
            ) {

                return `${minutes} min`;
            }

            const hours =
                Math.floor(
                    minutes / 60
                );

            const remaining =
                minutes % 60;

            if (
                remaining === 0
            ) {

                return `${hours} hr`;
            }

            return `${hours} hr ${remaining} min`;
        };


    /*
    ========================================================
    CLEAR ROUTE
    ========================================================
    */

    const clearRoute =
        () => {

            setRoute([]);

            setRouteInfo(
                null
            );

            setSelectedNgo(
                null
            );
        };


    /*
    ========================================================
    SORT NGOS
    ========================================================
    */

    const sortedNgos =
        useMemo(() => {

            return [
                ...ngos
            ].sort(
                (
                    a,
                    b
                ) =>
                    Number(
                        a.distanceMeters
                        || 0
                    )
                    -
                    Number(
                        b.distanceMeters
                        || 0
                    )
            );

        }, [
            ngos
        ]);


    /*
    ========================================================
    PAGE
    ========================================================
    */

    return (

        <div
            style={{
                minHeight:
                    "100vh",

                background:
                    "linear-gradient(135deg, #f4fff9 0%, #eefbf5 100%)",

                padding:
                    "35px 5%",

                fontFamily:
                    "Arial, Helvetica, sans-serif",

                color:
                    "#17211b"
            }}
        >

            <div
                style={{
                    maxWidth:
                        "1400px",

                    margin:
                        "0 auto"
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    style={{
                        marginBottom:
                            "25px"
                    }}
                >

                    <h1
                        style={{
                            margin:
                                "0 0 6px 0",

                            fontSize:
                                "34px",

                            fontWeight:
                                "700"
                        }}
                    >
                        NGO Finder
                    </h1>

                    <p
                        style={{
                            margin:
                                0,

                            color:
                                "#64746b",

                            fontSize:
                                "16px"
                        }}
                    >
                        Find nearby NGOs and organizations
                    </p>

                </div>


                {/* =================================================
                    SEARCH BOX
                ================================================= */}

                <div
                    style={{
                        display:
                            "flex",

                        gap:
                            "12px",

                        marginBottom:
                            "16px"
                    }}
                >

                    <input
                        value={
                            location
                        }

                        onChange={
                            (event) =>
                                setLocation(
                                    event.target.value
                                )
                        }

                        onKeyDown={
                            handleKeyDown
                        }

                        placeholder={
                            "Enter any Hyderabad location..."
                        }

                        style={{
                            flex:
                                1,

                            height:
                                "52px",

                            padding:
                                "0 18px",

                            border:
                                "1px solid #b9d7c7",

                            borderRadius:
                                "10px",

                            outline:
                                "none",

                            fontSize:
                                "16px",

                            background:
                                "white",

                            boxSizing:
                                "border-box"
                        }}
                    />


                    <button
                        onClick={
                            searchLocation
                        }

                        disabled={
                            loading
                        }

                        style={{
                            width:
                                "120px",

                            border:
                                "none",

                            borderRadius:
                                "10px",

                            background:
                                loading
                                    ? "#8bb49d"
                                    : "#25864b",

                            color:
                                "white",

                            fontSize:
                                "16px",

                            fontWeight:
                                "700",

                            cursor:
                                loading
                                    ? "wait"
                                    : "pointer"
                        }}
                    >

                        {loading
                            ? "Searching..."
                            : "Search"}

                    </button>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div
                        style={{
                            background:
                                "#fff3cd",

                            color:
                                "#795900",

                            border:
                                "1px solid #f0d98a",

                            borderRadius:
                                "10px",

                            padding:
                                "14px 18px",

                            marginBottom:
                                "15px"
                        }}
                    >
                        ⚠️ {error}
                    </div>

                )}


                {/* =================================================
                    LOCATION RESULT
                ================================================= */}

                {searchedLocation && (

                    <div
                        style={{
                            background:
                                "white",

                            borderRadius:
                                "12px",

                            padding:
                                "18px 20px",

                            marginBottom:
                                "18px",

                            boxShadow:
                                "0 2px 10px rgba(0,0,0,0.05)"
                        }}
                    >

                        <div
                            style={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                gap:
                                    "10px"
                            }}
                        >

                            <span
                                style={{
                                    fontSize:
                                        "22px"
                                }}
                            >
                                📍
                            </span>

                            <strong
                                style={{
                                    fontSize:
                                        "18px"
                                }}
                            >
                                {searchedLocation}
                            </strong>

                        </div>


                        <div
                            style={{
                                marginTop:
                                    "7px",

                                color:
                                    "#68756e"
                            }}
                        >
                            {loading
                                ? "Searching nearby organizations..."
                                : message ||
                                  `${sortedNgos.length} nearby organizations found`}
                        </div>

                    </div>

                )}


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div
                    style={{
                        display:
                            "grid",

                        gridTemplateColumns:
                            "minmax(0, 1.05fr) minmax(360px, 0.95fr)",

                        gap:
                            "20px",

                        alignItems:
                            "stretch"
                    }}
                >

                    {/* =================================================
                        MAP
                    ================================================= */}

                    <div
                        style={{
                            height:
                                "620px",

                            borderRadius:
                                "16px",

                            overflow:
                                "hidden",

                            boxShadow:
                                "0 4px 18px rgba(0,0,0,0.10)",

                            background:
                                "#dceee5"
                        }}
                    >

                        <MapContainer
                            center={
                                center
                            }

                            zoom={
                                searchedLocation
                                    ? 14
                                    : 11
                            }

                            scrollWheelZoom={
                                true
                            }

                            style={{
                                width:
                                    "100%",

                                height:
                                    "100%"
                            }}
                        >

                            <MapUpdater
                                center={
                                    center
                                }

                                zoom={
                                    searchedLocation
                                        ? 14
                                        : 11
                                }
                            />


                            <TileLayer
                                attribution={
                                    '&copy; OpenStreetMap contributors'
                                }

                                url={
                                    "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                }
                            />


                            {/* BLUE SEARCHED LOCATION */}

                            <Marker
                                position={
                                    center
                                }

                                icon={
                                    blueIcon
                                }
                            >

                                <Popup>

                                    <strong>
                                        {searchedLocation
                                            || "Selected location"}
                                    </strong>

                                    <br />

                                    Search location

                                </Popup>

                            </Marker>


                            {/* RED NGO MARKERS */}

                            {sortedNgos.map(
                                (
                                    ngo,
                                    index
                                ) => {

                                    if (
                                        ngo.latitude === undefined
                                        ||
                                        ngo.longitude === undefined
                                    ) {

                                        return null;
                                    }

                                    return (

                                        <Marker
                                            key={
                                                ngo.id
                                                ||
                                                ngo.placeId
                                                ||
                                                index
                                            }

                                            position={[
                                                Number(
                                                    ngo.latitude
                                                ),

                                                Number(
                                                    ngo.longitude
                                                )
                                            ]}

                                            icon={
                                                redIcon
                                            }

                                            eventHandlers={{
                                                click:
                                                    () =>
                                                        setSelectedNgo(
                                                            ngo
                                                        )
                                            }}
                                        >

                                            <Popup>

                                                <div
                                                    style={{
                                                        minWidth:
                                                            "220px"
                                                    }}
                                                >

                                                    <strong>
                                                        {ngo.name}
                                                    </strong>

                                                    <br />

                                                    <span>
                                                        📍{" "}
                                                        {
                                                            ngo.distance
                                                        }
                                                    </span>

                                                    <br />

                                                    <span>
                                                        {
                                                            ngo.address
                                                        }
                                                    </span>

                                                    <br />

                                                    <button
                                                        onClick={() =>
                                                            getDirections(
                                                                ngo
                                                            )
                                                        }

                                                        style={{
                                                            marginTop:
                                                                "10px",

                                                            border:
                                                                "none",

                                                            background:
                                                                "#25864b",

                                                            color:
                                                                "white",

                                                            padding:
                                                                "8px 12px",

                                                            borderRadius:
                                                                "7px",

                                                            cursor:
                                                                "pointer"
                                                        }}
                                                    >
                                                        Directions
                                                    </button>

                                                </div>

                                            </Popup>

                                        </Marker>
                                    );
                                }
                            )}


                            {/* BLUE ROUTE */}

                            {route.length > 0 && (

                                <Polyline
                                    positions={
                                        route
                                    }

                                    pathOptions={{
                                        color:
                                            "#1683d8",

                                        weight:
                                            6,

                                        opacity:
                                            0.85
                                    }}
                                />

                            )}

                        </MapContainer>

                    </div>


                    {/* =================================================
                        NGO LIST
                    ================================================= */}

                    <div
                        style={{
                            background:
                                "white",

                            borderRadius:
                                "16px",

                            padding:
                                "25px",

                            boxShadow:
                                "0 4px 18px rgba(0,0,0,0.08)",

                            height:
                                "620px",

                            boxSizing:
                                "border-box",

                            overflowY:
                                "auto"
                        }}
                    >

                        <div
                            style={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "space-between",

                                marginBottom:
                                    "8px"
                            }}
                        >

                            <h2
                                style={{
                                    margin:
                                        0,

                                    fontSize:
                                        "24px"
                                }}
                            >
                                Available Organizations
                            </h2>

                        </div>


                        <p
                            style={{
                                color:
                                    "#7a887f",

                                marginTop:
                                    "5px",

                                marginBottom:
                                    "20px"
                            }}
                        >
                            NGOs near{" "}
                            {searchedLocation
                                || "your selected location"}
                        </p>


                        {/* ROUTE INFORMATION */}

                        {selectedNgo && routeInfo && (

                            <div
                                style={{
                                    background:
                                        "#eef8ff",

                                    border:
                                        "1px solid #c5e5ff",

                                    borderRadius:
                                        "10px",

                                    padding:
                                        "14px",

                                    marginBottom:
                                        "15px"
                                }}
                            >

                                <strong>
                                    Route to{" "}
                                    {selectedNgo.name}
                                </strong>

                                <div
                                    style={{
                                        marginTop:
                                            "7px",

                                        color:
                                            "#31556e"
                                    }}
                                >
                                    🚗{" "}
                                    {routeInfo.distance}
                                    {" • "}
                                    {routeInfo.duration}
                                </div>


                                <button
                                    onClick={
                                        clearRoute
                                    }

                                    style={{
                                        marginTop:
                                            "10px",

                                        border:
                                            "none",

                                        background:
                                            "#e5eef5",

                                        padding:
                                            "7px 12px",

                                        borderRadius:
                                            "7px",

                                        cursor:
                                            "pointer"
                                    }}
                                >
                                    Clear Route
                                </button>

                            </div>

                        )}


                        {routeLoading && (

                            <div
                                style={{
                                    background:
                                        "#eef8ff",

                                    padding:
                                        "12px",

                                    borderRadius:
                                        "9px",

                                    marginBottom:
                                        "15px"
                                }}
                            >
                                Loading route...
                            </div>

                        )}


                        {/* NO RESULTS */}

                        {!loading
                            && sortedNgos.length === 0
                            && searchedLocation
                            && (

                                <div
                                    style={{
                                        minHeight:
                                            "300px",

                                        display:
                                            "flex",

                                        flexDirection:
                                            "column",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        textAlign:
                                            "center",

                                        color:
                                            "#758078"
                                    }}
                                >

                                    <div
                                        style={{
                                            fontSize:
                                                "45px",

                                            marginBottom:
                                                "12px"
                                        }}
                                    >
                                        📍
                                    </div>

                                    <h3
                                        style={{
                                            margin:
                                                "0 0 8px 0",

                                            color:
                                                "#26322b"
                                        }}
                                    >
                                        No mapped NGOs found
                                    </h3>

                                    <p
                                        style={{
                                            maxWidth:
                                                "400px",

                                            lineHeight:
                                                "1.5"
                                        }}
                                    >
                                        No NGO or social organization
                                        is currently mapped within
                                        5 km of this location.
                                    </p>

                                </div>

                            )}


                        {/* INITIAL STATE */}

                        {!searchedLocation
                            && !loading
                            && (

                                <div
                                    style={{
                                        minHeight:
                                            "300px",

                                        display:
                                            "flex",

                                        flexDirection:
                                            "column",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        textAlign:
                                            "center",

                                        color:
                                            "#758078"
                                    }}
                                >

                                    <div
                                        style={{
                                            fontSize:
                                                "45px"
                                        }}
                                    >
                                        🔎
                                    </div>

                                    <h3
                                        style={{
                                            color:
                                                "#26322b"
                                        }}
                                    >
                                        Search for a location
                                    </h3>

                                    <p>
                                        Try Tarnaka,
                                        Secunderabad,
                                        Sitaphalmandi,
                                        Malkajgiri,
                                        Lalapet,
                                        Uppal,
                                        Meerpet,
                                        or any other
                                        Hyderabad location.
                                    </p>

                                </div>

                            )}


                        {/* NGO CARDS */}

                        {sortedNgos.map(
                            (
                                ngo,
                                index
                            ) => (

                                <div
                                    key={
                                        ngo.id
                                        ||
                                        ngo.placeId
                                        ||
                                        index
                                    }

                                    style={{
                                        border:
                                            selectedNgo?.id ===
                                            ngo.id
                                                ? "2px solid #25864b"
                                                : "1px solid #e3ebe6",

                                        borderRadius:
                                            "12px",

                                        padding:
                                            "16px",

                                        marginBottom:
                                            "12px",

                                        background:
                                            selectedNgo?.id ===
                                            ngo.id
                                                ? "#f4fff8"
                                                : "#ffffff",

                                        transition:
                                            "0.2s"
                                    }}
                                >

                                    <div
                                        style={{
                                            display:
                                                "flex",

                                            gap:
                                                "12px"
                                        }}
                                    >

                                        {/* RED DOT */}

                                        <div
                                            style={{
                                                width:
                                                    "13px",

                                                height:
                                                    "13px",

                                                minWidth:
                                                    "13px",

                                                marginTop:
                                                    "6px",

                                                background:
                                                    "#e53935",

                                                borderRadius:
                                                    "50%",

                                                border:
                                                    "2px solid #ffcccc"
                                            }}
                                        />


                                        <div
                                            style={{
                                                flex:
                                                    1
                                            }}
                                        >

                                            <h3
                                                style={{
                                                    margin:
                                                        "0 0 7px 0",

                                                    fontSize:
                                                        "18px",

                                                    color:
                                                        "#1e2c24"
                                                }}
                                            >
                                                {ngo.name}
                                            </h3>


                                            {/* DISTANCE */}

                                            <div
                                                style={{
                                                    color:
                                                        "#25864b",

                                                    fontWeight:
                                                        "700",

                                                    marginBottom:
                                                        "7px"
                                                }}
                                            >
                                                📍{" "}
                                                {ngo.distance
                                                    ||
                                                    "Distance unavailable"}
                                            </div>


                                            {/* ADDRESS */}

                                            <div
                                                style={{
                                                    color:
                                                        "#65736b",

                                                    fontSize:
                                                        "14px",

                                                    lineHeight:
                                                        "1.45",

                                                    marginBottom:
                                                        "8px"
                                                }}
                                            >
                                                {ngo.address
                                                    ||
                                                    "Address not available"}
                                            </div>


                                            {/* TYPE */}

                                            {ngo.type && (

                                                <div
                                                    style={{
                                                        display:
                                                            "inline-block",

                                                        background:
                                                            "#edf7f1",

                                                        color:
                                                            "#28734a",

                                                        padding:
                                                            "4px 8px",

                                                        borderRadius:
                                                            "6px",

                                                        fontSize:
                                                            "12px",

                                                        marginBottom:
                                                            "8px"
                                                    }}
                                                >
                                                    {
                                                        ngo.type
                                                    }
                                                </div>

                                            )}


                                            {/* PHONE */}

                                            {ngo.phone
                                                &&
                                                ngo.phone !==
                                                    "Phone not available"
                                                && (

                                                    <div
                                                        style={{
                                                            fontSize:
                                                                "14px",

                                                            marginTop:
                                                                "4px"
                                                        }}
                                                    >
                                                        📞{" "}
                                                        {
                                                            ngo.phone
                                                        }
                                                    </div>

                                                )}


                                            {/* HOURS */}

                                            {ngo.openingHours
                                                &&
                                                ngo.openingHours !==
                                                    "Opening hours not available"
                                                && (

                                                    <div
                                                        style={{
                                                            fontSize:
                                                                "14px",

                                                            marginTop:
                                                                "4px",

                                                            color:
                                                                "#68756e"
                                                        }}
                                                    >
                                                        🕒{" "}
                                                        {
                                                            ngo.openingHours
                                                        }
                                                    </div>

                                                )}


                                            {/* BUTTON */}

                                            <button
                                                onClick={() =>
                                                    getDirections(
                                                        ngo
                                                    )
                                                }

                                                style={{
                                                    marginTop:
                                                        "12px",

                                                    border:
                                                        "none",

                                                    background:
                                                        "#25864b",

                                                    color:
                                                        "white",

                                                    padding:
                                                        "9px 14px",

                                                    borderRadius:
                                                        "7px",

                                                    cursor:
                                                        "pointer",

                                                    fontWeight:
                                                        "600"
                                                }}
                                            >
                                                Directions
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* =================================================
                    ATTRIBUTION
                ================================================= */}

                <div
                    style={{
                        marginTop:
                            "14px",

                        textAlign:
                            "center",

                        color:
                            "#758078",

                        fontSize:
                            "12px"
                    }}
                >
                    Map data © OpenStreetMap contributors
                </div>

            </div>

        </div>
    );
}


export default NGO;