import axios from '../../api/axios';

export const fetchProduct = async (productId) => {
    try {
        const response = await axios.get(`/Product/${productId}`);
        return response.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const fetchProducts = async () => {
    try {
        const response = await axios.get("/Product/GetProductAndQuantity");
        return response.data;
    } catch (error) {
        console.log("Failed to fetch product list: ", error.message);
        return [];
    }
};

export const fetchLastProductId = async () => {
    try {
        const response = await axios.get("/Product/GetLastId");
        return response.data;
    } catch (error) {
        console.log("Failed to fetch last product id: ", error.message);
        return "";
    }
}

export const AddProduct = async (productData) => {
    try {
        const res = await axios.post(`Product`, productData);
        return res;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const UpdateProduct = async (productData) => {
    try {
        const res = await axios.put(`Product/${productData.id}`, productData);
        return res;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const DeleteProduct = async (id) => {
    try {
        const res = await axios.put(`Product/DeleteProduct/${id}`);
        return res;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}
