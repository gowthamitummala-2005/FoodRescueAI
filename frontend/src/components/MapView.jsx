import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// =========================================================
// FIX DEFAULT LEAFLET MARKER ICON
// =========================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});


// =========================================================
// SEARCH LOCATION MARKER
// =========================================================

const searchedLocationIcon =
  new L.Icon({
    iconUrl:
      "https://maps.google.com/mapfiles/ms/icons/red-dot.png",

    iconSize: [40, 40],

    iconAnchor: [20, 40],

    popupAnchor: [0, -40]
  });


// =========================================================
// NGO MARKER
// =========================================================

const ngoIcon =
  new L.Icon({
    iconUrl:
      "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",

    iconSize: [35, 35],

    iconAnchor: [17, 35],

    popupAnchor: [0, -35]
  });


// =========================================================
// CHANGE MAP CENTER
// =========================================================

function MapCenter({
  latitude,
  longitude
}) {

  const map = useMap();

  useEffect(() => {

    if (
      latitude !== null &&
      longitude !== null
    ) {

      map.setView(
        [latitude, longitude],
        14
      );
    }

  }, [
    latitude,
    longitude,
    map
  ]);

  return null;
}


// =========================================================
// MAP VIEW
// =========================================================

function MapView({
  searchedLocation,
  ngos = []
}) {

  if (
    !searchedLocation ||
    searchedLocation.latitude === undefined ||
    searchedLocation.longitude === undefined
  ) {

    return (
      <div className="map-empty">

        <p>
          Search a location to view the map.
        </p>

      </div>
    );
  }


  const center = [
    searchedLocation.latitude,
    searchedLocation.longitude
  ];


  return (

    <div
      className="ngo-map-container"
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "15px",
        overflow: "hidden"
      }}
    >

      <MapContainer
        center={center}
        zoom={14}
        style={{
          width: "100%",
          height: "100%"
        }}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        <MapCenter
          latitude={
            searchedLocation.latitude
          }
          longitude={
            searchedLocation.longitude
          }
        />


        {/* ================================================
            MAIN SEARCHED LOCATION
        ================================================= */}

        <Marker
          position={center}
          icon={searchedLocationIcon}
        >

          <Popup>

            <strong>
              Searched Location
            </strong>

            <br />

            {searchedLocation.location}

          </Popup>

        </Marker>


        {/* ================================================
            NGO MARKERS
        ================================================= */}

        {ngos.map(
          (ngo, index) => {

            if (
              ngo.latitude === undefined ||
              ngo.longitude === undefined
            ) {

              return null;
            }


            return (

              <Marker
                key={
                  ngo.placeId ||
                  index
                }
                position={[
                  ngo.latitude,
                  ngo.longitude
                ]}
                icon={ngoIcon}
              >

                <Popup>

                  <strong>
                    {ngo.name}
                  </strong>

                  <br />

                  {ngo.address}

                  <br />

                  <strong>
                    Distance:
                  </strong>{" "}

                  {ngo.distanceKm} km

                  <br />
                  <br />

                  <a
                    href={
                      `https://www.google.com/maps/dir/?api=1` +
                      `&origin=${searchedLocation.latitude},${searchedLocation.longitude}` +
                      `&destination=${ngo.latitude},${ngo.longitude}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    🧭 Get Directions
                  </a>

                </Popup>

              </Marker>
            );
          }
        )}

      </MapContainer>

    </div>
  );
}

export default MapView;