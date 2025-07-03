const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");
const axios = require("axios");


module.exports.getCoordinates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;

  if (!address) {
    return res
      .status(400)
      .json({ error: "Address query parameter is required" });
  }

  try {
    const coordinates = await mapService.getAddressCoordinates(address);
    return res.status(200).json(coordinates);
  } catch (error) {
    console.error(
      "Error fetching coordinates:",
      error.response?.data || error.message
    );
    return res.status(404).json({ error: "Coordinates not found" });
  }
};

module.exports.getDistanceTime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
      return res
        .status(400)
        .json({
          error: "Origin and destination query parameters are required",
        });
    }

    const distanceTime = await mapService.getDistanceTime(
      origin,
      destination
    );
    return res.status(200).json(distanceTime);
  } catch (error) {
    console.error(
      "Error fetching distance and time:",
      error.response?.data || error.message
    );
    return res.status(404).json({ error: "Distance and time not found" });
  }
};

module.exports.getAutoCompleteSuggestions = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;

        if (!input) {
            return res
                .status(400)
                .json({ error: "Input query parameter is required" });
        }

        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        return res.status(200).json(suggestions);


    } catch (error) {
        console.error(
            "Error fetching autocomplete suggestions:",
            error.response?.data || error.message
        );
        return res.status(404).json({ error: "Suggestions not found" });
        
    }
}

module.exports.getRoute = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { pickup, destination } = req.query;

    const route = await mapService.getRoute(pickup, destination);
    return res.status(200).json(route);
  } catch (error) {
    console.error("Error fetching route:", error);
    return res.status(500).json({ error: "Route not found" });
  }
};
module.exports.getPlaceDetails = async (req, res) => {
  const { place_id } = req.query;

  if (!place_id) {
    return res.status(400).json({ message: 'place_id is required' });
  }

  try {
    const response = await axios.get('https://maps.gomaps.pro/maps/api/geocode/json', {
      params: {
        place_id,
        key: process.env.GOOGLE_MAPS_APIS,
      },
    });

    console.log('Google API Response:', response.data);

    // ✅ Correct success check
    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return res.json({ location });
    } else {
      return res.status(500).json({ message: 'Google Maps API Error', status: response.data.status });
    }

  } catch (error) {
    console.error('Error fetching Google Place Details:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
