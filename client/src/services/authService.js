import axiosInstance from "./axiosInstance";

export const authService = {
  register: async (payload) => {
    const { data } = await axiosInstance.post("/auth/register", payload);
    return data.data; // { user, token }
  },

  login: async (payload) => {
    const { data } = await axiosInstance.post("/auth/login", payload);
    return data.data; // { user, token }
  },

  logout: async () => {
    const { data } = await axiosInstance.post("/auth/logout");
    return data;
  },

  getProfile: async () => {
    const { data } = await axiosInstance.get("/auth/profile");
    return data.data.user;
  },

  updateProfile: async (payload) => {
    const { data } = await axiosInstance.put("/auth/profile", payload);
    return data.data.user;
  },
};
