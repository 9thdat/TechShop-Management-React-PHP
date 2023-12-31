import axios from '../../api/axios';

export const fetchProductPhone = async (productId) => {
    try {
        const productPhoneResponse = await axios.get(`/ParameterPhone/GetParameterPhone.php?ProductId=${productId}`);
        return productPhoneResponse.data.data || {};
    } catch (error) {
        console.log("Failed to fetch product phone list: ", error.message);
        return {};
    }
};

export const AddProductPhone = async (data) => {
    try {
        const res = await axios.post('/ParameterPhone/AddParameterPhone.php', data);
        return res.data;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}

export const UpdateProductPhone = async (data) => {
    try {
        const res = await axios.put(`/ParameterPhone/UpdateParameterPhone.php`, data);
        return res.data;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}

export const DeleteProductPhone = async (id) => {
    try {
        const res = await axios.delete(`/ParameterPhone/DeleteParameterPhone.php?id=${id}`);
        return res.data;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}

