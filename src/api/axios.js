import axios from "axios";

export default axios.create({
    baseURL: "https://noizi.000webhostapp.com/api",
    headers: {
        "Content-type": "application/json"
    }
});
