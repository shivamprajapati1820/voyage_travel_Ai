import { useEffect, useState } from "react";

const STORAGE_KEY = "voyage_saved_destinations";

const readStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

/**
 * Lets the user "heart" a destination card on the Home page without
 * needing an account/backend call - just persisted locally. Returns
 * a Set of saved ids plus a toggle function.
 */
const useSavedDestinations = () => {
  const [saved, setSaved] = useState(readStored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved]));
  }, [saved]);

  const toggleSaved = (id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return { saved, toggleSaved, isSaved: (id) => saved.has(id) };
};

export default useSavedDestinations;