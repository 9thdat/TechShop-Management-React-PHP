import axios from "axios";

export default axios.create({
    baseURL: "http://localhost/techshop/api",
    headers: {
        "Content-type": "application/json"
    }
});
