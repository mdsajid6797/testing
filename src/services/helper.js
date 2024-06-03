import axios from "axios";

// export const BASE_URL = 'http://i-chest.com:8080';

export const BASE_URL = 'http://localhost:8080';


export const myAxios = axios.create({
    baseURL: BASE_URL,
}); 