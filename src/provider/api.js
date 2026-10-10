import axios from "axios";

/**
 * altera a baseURL fixa em localhost para um placeholder "/api"
 * serve para alterar o host do back quando rodar a aplicação no docker
 * o proxy em vite.config.js serve para direcionar de "/api" para o backend local (npm run dev)
 */
export const api = axios.create({
    baseURL: "/api",
    withCredentials: true
});

// ia
export const iaApi = axios.create({
    baseURL: import.meta.env.VITE_IA_API_URL || "http://localhost:8080",
    withCredentials: false
})

});