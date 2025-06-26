const axios = require('axios');
module.exports.getAddressCoordinates = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_APIS;
    const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    // const url2= `https://maps.gomaps.pro/maps/api/place/details/json?place_id=&key=${apiKey}`
    try {
        const response = await axios.get(url);
        console.log("Google Maps API response:", response.data);

        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to find address coordinates');
        }
    } catch (error) {
        console.error('Error fetching address coordinates:', error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }
    const apiKey = process.env.GOOGLE_MAPS_APIS;
    const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        console.log("Google Maps API response:", response.data);

        if (
            response.data.status === 'OK' &&
            response.data.rows &&
            response.data.rows[0] &&
            response.data.rows[0].elements &&
            response.data.rows[0].elements[0] &&
            response.data.rows[0].elements[0].status === 'OK'
        ) {
            const element = response.data.rows[0].elements[0];
            if (element.distance && element.duration) {
                return {
                    distance: element.distance,
                    duration: element.duration
                };
            } else {
                throw new Error('Could not fetch distance or duration from API response');
            }
        } else {
            throw new Error('Unable to fetch distance and time');
        }
    } catch (error) {
        console.error('Error fetching distance and time:', error);
        throw error;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required for autocomplete suggestions');
    }
    const apiKey = process.env.GOOGLE_MAPS_APIS;
    const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        console.log("Google Maps API response:", response.data);

        if (response.data.status === 'OK') {
            return response.data.predictions;
        } else {
            throw new Error('Unable to fetch autocomplete suggestions');
        }
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        throw error;
    }
}

module.exports.getRoute = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const [pickupLat, pickupLng] = pickup.split(",").map(Number);
  const [destLat, destLng] = destination.split(",").map(Number);

  if (
    isNaN(pickupLat) || isNaN(pickupLng) ||
    isNaN(destLat) || isNaN(destLng)
  ) {
    throw new Error("Invalid coordinates format");
  }

  const url = `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${destLng},${destLat}?overview=full&geometries=geojson`;

  const response = await axios.get(url);

  const coordinates = response?.data?.routes?.[0]?.geometry?.coordinates;

  if (!coordinates) {
    throw new Error("Invalid route data from OSRM");
  }

  return coordinates.map(([lng, lat]) => ({ lat, lng }));
};
