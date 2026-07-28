import axiosInstance from "./axiosInstance";

export const aiService = {
  generatePlan: async (payload) => {
    const { data } = await axiosInstance.post("/ai/generate", payload);
    return data.data.aiResponse;
  },

  generateTimeGuide: async (payload) => {
    const { data } = await axiosInstance.post("/ai/time-guide", payload);
    return data.data.timeGuide;
  },
};