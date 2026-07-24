import { createContext, useContext, useState, useCallback } from "react";
import { tripService } from "../services/tripService";

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);

  const fetchTrips = useCallback(async () => {
    setTripsLoading(true);
    try {
      const data = await tripService.getTrips();
      setTrips(data);
      return data;
    } finally {
      setTripsLoading(false);
    }
  }, []);

  const removeTripFromState = (id) => {
    setTrips((prev) => prev.filter((trip) => trip._id !== id));
  };

  const addTripToState = (trip) => {
    setTrips((prev) => [trip, ...prev]);
  };

  return (
    <TripContext.Provider
      value={{ trips, tripsLoading, fetchTrips, removeTripFromState, addTripToState }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrips must be used within a TripProvider");
  }
  return context;
};
