import axios from '../../api/axios';


export const fetchProductCable = async (productId) => {
    try {
        const productCableResponse = await axios.get(`/ParameterCable/ProductId=${productId}`);
        return productCableResponse.data.length > 0 ? productCableResponse.data[0] : {};
    } catch (error) {
        console.log("Failed to fetch product cable list: ", error.message);
        return {};
    }
};

export const AddProductCable = async (data) => {
    try {
        const res = await axios.post('/ParameterCable', data);
        return res;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}

export const UpdateProductCable = async (data) => {
    try {
        const res = await axios.put(`/ParameterCable/${data.id}`, data);
        return res;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}

export const DeleteProductCable = async (id) => {
    try {
        const res = await axios.delete(`/ParameterCable/${id}`);
        return res;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}