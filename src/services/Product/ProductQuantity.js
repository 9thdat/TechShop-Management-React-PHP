import axios from '../../api/axios';

export const fetchProductQuantity = async (productId) => {
    if (productId === "") {
        return [];
    }
    try {
        const response = await axios.get(`/ProductQuantity/ProductId=${productId}`);
        return response.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const fetchTotalProductQuantity = async (productId, color) => {
    if (productId === "" || color === "") {
        return 0;
    }

    try {
        const response = await axios.get(`/ProductQuantity/TotalQuantity/ProductId=${productId}&ProductColor=${color}`);
        return response.data;
    } catch (err) {
        console.error(err);
        return 0;
    }
};

export const AddProductQuantity = async (productQuantityData) => {
    try {
        const res = await axios.post(`ProductQuantity`, productQuantityData);
        return res;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const UpdateProductQuantity = async (productQuantityData) => {
    try {
        const res = await axios.put(`ProductQuantity/${productQuantityData.id}`, productQuantityData);
        return res;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const DeleteProductQuantity = async (id) => {
    try {
        const res = await axios.delete(`/ProductQuantity/${id}`);
        return res;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}