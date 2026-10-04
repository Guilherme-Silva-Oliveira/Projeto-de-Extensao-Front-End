import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081",
    withCredentials: true
});

// ia
export const iaApi = axios.create({
    baseURL: import.meta.env.VITE_IA_API_URL || "http://localhost:8080",
    withCredentials: false
});