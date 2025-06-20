const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");

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