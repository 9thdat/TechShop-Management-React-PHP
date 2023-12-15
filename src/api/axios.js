import axios from "axios";

export default axios.create({
    baseURL: "https://localhost:5432/api",
});

export const locationApi = axios.create({
    baseURL: "https://online-gateway.ghn.vn/shiip/public-api/master-data",
});
