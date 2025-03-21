import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://api.trovup.online/',
    headers: {
        'Content-Type' : 'application/json'
    }
})

export default axiosInstance;

