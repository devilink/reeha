"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  GeocoderAutocomplete,
} from "@geoapify/geocoder-autocomplete";
import "./AddressAutocomplete.css";

export interface AddressResult {
  formatted: string;
  addressLine1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2, e.g. "in", "us"
}

interface AddressAutocompleteProps {
  onAddressSelect: (result: AddressResult) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function AddressAutocomplete({
  onAddressSelect,
  placeholder = "Start typing your address...",
  initialValue = "",
}: AddressAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<GeocoderAutocomplete | null>(null);
  const callbackRef = useRef(onAddressSelect);

  // Keep callback ref up-to-date without re-initializing the autocomplete
  useEffect(() => {
    callbackRef.current = onAddressSelect;
  }, [onAddressSelect]);

  const handleSelect = useCallback((location: any) => {
    if (!location) return;

    // Geoapify returns GeoJSON Feature: { type: "Feature", properties: {...}, geometry: {...} }
    const props = location.properties || location;

    const result: AddressResult = {
      formatted: props.formatted || "",
      addressLine1: props.address_line1 || props.street || "",
      city: props.city || props.town || props.village || "",
      state: props.state || props.county || "",
      postcode: props.postcode || "",
      country: props.country || "",
      countryCode: (props.country_code || "").toUpperCase(),
    };

    callbackRef.current(result);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_AUTOCOMPLETE_KEY;
    if (!apiKey) {
      console.error("Missing NEXT_PUBLIC_GEOAPIFY_AUTOCOMPLETE_KEY");
      return;
    }

    // Clear container from any previous initialization
    containerRef.current.innerHTML = "";

    const autocomplete = new GeocoderAutocomplete(
      containerRef.current,
      apiKey,
      {
        placeholder,
        debounceDelay: 300,
        limit: 5,
        lang: "en",
      }
    );

    // Set initial value if provided
    if (initialValue) {
      autocomplete.setValue(initialValue);
    }

    autocomplete.on("select", handleSelect);

    autocompleteRef.current = autocomplete;

    return () => {
      autocomplete.off("select", handleSelect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="geoapify-autocomplete-wrapper md:col-span-2">
      <div ref={containerRef} className="geoapify-autocomplete-container" />
    </div>
  );
}
