import axios from '../../api/axios';

export const fetchProduct = async (productId) => {
    try {
        const response = await axios.get(`/Product/GetProduct.php?id=${productId}`);
        return response.data.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const fetchProducts = async () => {
    try {
        const response = await axios.get("/Product/GetProductAndQuantity.php");
        return response.data.data;
    } catch (error) {
        console.log("Failed to fetch product list: ", error.message);
        return [];
    }
};

export const fetchLastProductId = async () => {
    try {
        const response = await axios.get("/Product/GetLastId.php");
        return response.data;
    } catch (error) {
        console.log("Failed to fetch last product id: ", error.message);
        return "";
    }
}

export const AddProduct = async (productData) => {
    try {
        const res = await axios.post(`/Product/AddProduct.php`, productData);
        return res.data;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const UpdateProduct = async (productData) => {
    try {
        const res = await axios.put(`/Product/UpdateProduct.php`, productData);
        return res.data;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const DeleteProduct = async (id) => {
    try {
        const res = await axios.put(`/Product/DeleteProduct.php?id=${id}`);
        return res.data;
    } catch (e) {
        console.log(e);
        return e.response;
    }
}
