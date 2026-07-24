import { useEffect, useState } from "react";
import { geocodeService } from "../services/geocodeService";
import useDebounce from "./useDebounce";

/**
 * Drives the destination autocomplete field. Debounces the raw query,
 * then hits OpenStreetMap's Nominatim search endpoint for suggestions.
 */
const usePlaceAutocomplete = (query) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 450);

  useEffect(() => {
    let isActive = true;

    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const results = await geocodeService.searchPlaces(debouncedQuery);
        if (isActive) setSuggestions(results);
      } catch (err) {
        if (isActive) setSuggestions([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchSuggestions();
    return () => {
      isActive = false;
    };
  }, [debouncedQuery]);

  return { suggestions, loading };
};

export default usePlaceAutocomplete;
