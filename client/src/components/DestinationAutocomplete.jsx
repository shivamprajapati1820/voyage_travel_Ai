import { useState, useRef, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import usePlaceAutocomplete from "../hooks/usePlaceAutocomplete";

/**
 * Text input with a live dropdown of place suggestions from
 * OpenStreetMap Nominatim. Calls onSelect({ displayName, lat, lng })
 * when the user picks a suggestion.
 */
const DestinationAutocomplete = ({
  value,
  onChange,
  onSelect,
  error,
  placeholder = "Where do you want to go? e.g. Goa, India",
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { suggestions, loading } = usePlaceAutocomplete(value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (place) => {
    onSelect(place);
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={`input-field pl-10 ${error ? "border-red-400" : ""}`}
          autoComplete="off"
        />
        {loading && (
          <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-400" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-100 bg-white py-1 shadow-card">
          {suggestions.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => handleSelect(place)}
                className="flex w-full items-start gap-2 px-4 py-2 text-left text-sm text-slate-600 hover:bg-primary-50"
              >
                <MapPin size={14} className="mt-0.5 shrink-0 text-primary-500" />
                <span>{place.displayName}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DestinationAutocomplete;