import axios from "axios";

export const api = axios.create({
    baseURL: "/api",
    withCredentials: true
});

// ia
export const iaApi = axios.create({
    baseURL: "/ia",
    withCredentials: false
});
