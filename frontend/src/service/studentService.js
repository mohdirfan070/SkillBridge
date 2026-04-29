import api from "./axios";

export const registerUser = async (role) => {
  const res = await api.post("/signup", { role });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/api/users/me");
  return res.data;
};