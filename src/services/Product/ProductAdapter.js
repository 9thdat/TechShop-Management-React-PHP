import axios from '../../api/axios';

export const fetchProductAdapter = async (productId) => {
    try {
        const productAdapterResponse = await axios.get(`/ParameterAdapter/GetParameterAdapter.php?ProductId=${productId}`);
        return productAdapterResponse.data.data || {};
    } catch (error) {
        console.log("Failed to fetch product adapter list: ", error.message);
        return {};
    }
};

export const AddProductAdapter = async (data) => {
    try {
        const response = await axios.post('/ParameterAdapter/AddParameterAdapter.php', data);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response;
    }
}

export const UpdateProductAdapter = async (data) => {
    try {
        const response = await axios.put(`/ParameterAdapter/UpdateParameterAdapter.php`, data);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response;
    }
}

export const DeleteProductAdapter = async (id) => {
    try {
        const response = await axios.delete(`/ParameterAdapter/DeleteParameterAdapter.php?id=${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response;
    }
}