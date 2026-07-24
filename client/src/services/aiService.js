import axiosInstance from "./axiosInstance";

export const aiService = {
  generatePlan: async (payload) => {
    const { data } = await axiosInstance.post("/ai/generate", payload);
    return data.data.aiResponse;
  },
};
