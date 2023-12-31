import axios from '../../api/axios';


export const fetchProductCable = async (productId) => {
    try {
        const productCableResponse = await axios.get(`/ParameterCable/GetParameterCable.php?ProductId=${productId}`);
        return productCableResponse.data.data || {};
    } catch (error) {
        console.log("Failed to fetch product cable list: ", error.message);
        return {};
    }
};

export const AddProductCable = async (data) => {
    try {
        const res = await axios.post('/ParameterCable/AddParameterCable.php', data);
        return res.data;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}

export const UpdateProductCable = async (data) => {
    try {
        const res = await axios.put(`/ParameterCable/UpdateParameterCable.php`, data);
        return res.data;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}

export const DeleteProductCable = async (id) => {
    try {
        const res = await axios.delete(`/ParameterCable/DeleteParameterCable.php?id=${id}`);
        return res.data;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}