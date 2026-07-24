import axiosInstance from "./axiosInstance";

export const tripService = {
  createTrip: async (payload) => {
    const { data } = await axiosInstance.post("/trips/create", payload);
    return data.data.trip;
  },

  getTrips: async () => {
    const { data } = await axiosInstance.get("/trips");
    return data.data.trips;
  },

  getTripById: async (id) => {
    const { data } = await axiosInstance.get(`/trips/${id}`);
    return data.data.trip;
  },

  deleteTrip: async (id) => {
    const { data } = await axiosInstance.delete(`/trips/${id}`);
    return data;
  },

  regenerateTrip: async (id) => {
    const { data } = await axiosInstance.post(`/trips/${id}/regenerate`);
    return data.data.trip;
  },
};
