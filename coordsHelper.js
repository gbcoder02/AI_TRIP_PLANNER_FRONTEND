// src/utils/coordsHelper.js
export const parseCoordinates = (coords) => {
  // Handle cases where coords might be an object
  if (typeof coords === 'object' && coords !== null) {
    return {
      lat: coords.lat || coords.latitude || coords[0],
      lng: coords.lng || coords.lon || coords.longitude || coords[1]
    };
  }
  
  // Handle string format "lat,lng"
  if (typeof coords === 'string') {
    const parts = coords.split(',');
    if (parts.length === 2) {
      return {
        lat: parseFloat(parts[0].trim()),
        lng: parseFloat(parts[1].trim())
      };
    }
  }
  
  // Fallback for unexpected formats
  console.warn('Unexpected coordinates format:', coords);
  return { lat: 0, lng: 0 };
};