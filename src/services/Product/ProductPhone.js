import axios from '../../api/axios';

export const fetchProductPhone = async (productId) => {
    try {
        const productPhoneResponse = await axios.get(`/ParameterPhone/ProductId=${productId}`);
        return productPhoneResponse.data.length > 0 ? productPhoneResponse.data[0] : {};
    } catch (error) {
        console.log("Failed to fetch product phone list: ", error.message);
        return {};
    }
};

export const AddProductPhone = async (data) => {
    try {
        const res = await axios.post('/ParameterPhone', data);
        return res;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}

export const UpdateProductPhone = async (data) => {
    try {
        const res = await axios.put(`/ParameterPhone/${data.id}`, data);
        return res;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}

export const DeleteProductPhone = async (id) => {
    try {
        const res = await axios.delete(`/ParameterPhone/${id}`);
        return res;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}

