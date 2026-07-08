import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // sends the refresh token cookie automatically
});

export default api;