import axios from "../../api/axios";

export const fetchCategory = async () => {
    try {
        const categoryResponse = await axios.get("/Category/GetAllCategories.php");
        return categoryResponse.data.length > 0 ? categoryResponse.data : [];
    } catch (error) {
        console.log("Failed to fetch category list: ", error.message);
        return [];
    }
};