// src/utils/opentripmap.js

import { parseCoordinates } from "./coordsHelper";
const API_KEY = "5ae2e3f221c38a28845f05b672fcd0827b8a4db77f2ef01806486dae"; // Get from https://opentripmap.io/
const API_DELAY = 1000; // Add delay between requests to avoid rate limiting
export const getPlaceImages = async (coords) => {
  try {
    // Parse coordinates from any format
    const { lat, lng } = parseCoordinates(coords);

    // Skip if coordinates are invalid
    if (isNaN(lat) || isNaN(lng)) {
      console.warn("Invalid coordinates:", coords);
      return null;
    }

    // Add delay to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));

    // First request: Find places near coordinates
    const radiusResponse = await fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=500&lon=${lng}&lat=${lat}&format=json&apikey=${API_KEY}`
    );

    // Handle rate limiting
    if (radiusResponse.status === 429) {
      throw new Error("API rate limit exceeded");
    }

    const places = await radiusResponse.json();

    // If no places found or empty response
    if (!places || !Array.isArray(places) || places.length === 0) {
      return null;
    }

    // Find the first place with a valid xid
    const validPlace = places.find((place) => place.xid);
    if (!validPlace) return null;

    // Second request: Get place details
    const detailsResponse = await fetch(
      `https://api.opentripmap.com/0.1/en/places/xid/${validPlace.xid}?apikey=${API_KEY}`
    );

    if (detailsResponse.status === 429) {
      throw new Error("API rate limit exceeded");
    }

    const placeDetails = await detailsResponse.json();
    return placeDetails.preview?.source || null;
  } catch (error) {
    console.error("Error fetching images from OpenTripMap:", error.message);
    return null;
  }
};
