import axios from '../../api/axios'

export const fetchDiscounts = async () => {
    try {
        const response = await axios.get("/Discount/GetAllDiscounts.php");
        return response.data.data || [];
    } catch (e) {
        console.error(e.message);
        return {
            data: []
        };
    }
}

export const AddDiscount = async (discount) => {
    try {
        const response = await axios.post("/Discount/CreateDiscount.php", discount);
        return response.data;
    } catch (e) {
        console.log(e);
        return {
            status: 400
        };
    }
}

export const UpdateDiscount = async (discount) => {
    try {
        const response = await axios.put("Discount/UpdateDiscount.php", discount);
        return response;
    } catch (e) {
        console.log(e);
        return {
            status: 400
        };
    }
}

export const fetchLastDiscountId = async () => {
    try {
        const response = await axios.get("/Discount/GetLastId.php");
        return response.data.data;
    } catch (e) {
        console.error(e.message);
        return {
            data: ""
        };
    }
}
export const fetchDiscountCodeById = async (id) => {
    if (id === null) return "";
    try {
        const response = await axios.get(`/Discount/GetDiscountById.php?id=${id}`);
        return response.data;
    } catch (e) {
        console.log(e);
        return "";
    }
}

export const fetchDiscountByCode = async (code) => {
    if (!code) return;
    try {
        const response = await axios.get(`/Discount/GetDiscountByCode.php?Code=${code}`);
        return response.data;
    } catch (e) {
        console.error(e.message);
        return e.response;
    }
}