import api from "./axios";

// register user after role selection
export const registerUser = async (data) => {
  const res = await api.post("/users/register", { data });
  return res.data;
};

// get current logged-in user
export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};