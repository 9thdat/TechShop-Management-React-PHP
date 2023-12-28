import axios from '../../api/axios';

export const fetchProductAdapter = async (productId) => {
    try {
        const productAdapterResponse = await axios.get(`/ParameterAdapter/ProductId=${productId}`);
        return productAdapterResponse.data.length > 0 ? productAdapterResponse.data[0] : {};
    } catch (error) {
        console.log("Failed to fetch product adapter list: ", error.message);
        return {};
    }
};

export const AddProductAdapter = async (data) => {
    try {
        const response = await axios.post('/ParameterAdapter', data);
        return response;
    } catch (error) {
        console.log(error);
        return error.response;
    }
}

export const UpdateProductAdapter = async (data) => {
    try {
        const response = await axios.put(`/ParameterAdapter/${data.id}`, data);
        return response;
    } catch (error) {
        console.log(error);
        return error.response;
    }
}

export const DeleteProductAdapter = async (id) => {
    try {
        const response = await axios.delete(`/ParameterAdapter/${id}`);
        return response;
    } catch (error) {
        console.log(error);
        return error.response;
    }
}