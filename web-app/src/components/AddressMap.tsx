"use client";

import { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { AddressResult } from "./AddressAutocomplete";

// Fix standard marker icons for Next.js / webpack
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface AddressMapProps {
  onAddressSelect: (result: AddressResult) => void;
  initialLocation?: { lat: number; lng: number } | null;
}

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }; // India Center

function MapEvents({ onLocationSelect }: { onLocationSelect: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

export default function AddressMap({ onAddressSelect, initialLocation }: AddressMapProps) {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLocation ? new L.LatLng(initialLocation.lat, initialLocation.lng) : null
  );
  const [isFetching, setIsFetching] = useState(false);
  const markerRef = useRef<L.Marker>(null);

  const fetchAddress = async (lat: number, lng: number) => {
    setIsFetching(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_AUTOCOMPLETE_KEY;
      if (!apiKey) {
        console.error("Missing Geoapify API key");
        return;
      }
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const props = data.features[0].properties;

        const result: AddressResult = {
          formatted: props.formatted || "",
          addressLine1: props.street || props.address_line1 || props.name || "",
          city: props.city || props.town || props.village || "",
          state: props.state || props.county || "",
          postcode: props.postcode || "",
          country: props.country || "",
          countryCode: (props.country_code || "").toUpperCase(),
        };

        onAddressSelect(result);
      }
    } catch (err) {
      console.error("Failed to reverse geocode:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleLocationSelect = (latlng: L.LatLng) => {
    setPosition(latlng);
    fetchAddress(latlng.lat, latlng.lng);
  };

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const latlng = marker.getLatLng();
        setPosition(latlng);
        fetchAddress(latlng.lat, latlng.lng);
      }
    },
  };

  return (
    <div className="w-full relative h-[300px] mb-6 rounded-md overflow-hidden border border-gray-200 z-0">
      <MapContainer
        center={position || DEFAULT_CENTER}
        zoom={position ? 15 : 4}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onLocationSelect={handleLocationSelect} />
        {position && (
          <Marker
            position={position}
            draggable={true}
            eventHandlers={eventHandlers}
            ref={markerRef}
          />
        )}
      </MapContainer>
      
      {isFetching && (
        <div className="absolute top-2 right-2 z-[1000] bg-white px-3 py-1 rounded-md shadow-sm text-sm text-gray-600 flex items-center gap-2">
           <span className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></span>
           Fetching address...
        </div>
      )}
      {!position && !isFetching && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 px-4 py-2 rounded-full shadow-sm text-sm text-gray-700 pointer-events-none font-medium">
           Tap on the map to select your location
        </div>
      )}
    </div>
  );
}
