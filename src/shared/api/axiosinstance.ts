import axios from "axios";

export const AxiosInstance = axios.create({
    baseURL: 'https://rickandmortyapi.com/api',
})
