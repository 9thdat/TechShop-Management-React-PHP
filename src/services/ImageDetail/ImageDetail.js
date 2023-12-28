import axios from '../../api/axios';

export const fetchProductImage = async (productId) => {
    if (productId === "") {
        return [];
    }
    try {
        const response = await axios.get(`/ImageDetail/ProductId=${productId}`);
        return response.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const AddImageDetail = async (imageDetailData) => {
    try {
        const res = await axios.post(`ImageDetail`, imageDetailData);
        return res;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const UpdateImageDetail = async (imageDetailData) => {
    try {
        const res = await axios.put(`ImageDetail/${imageDetailData.id}`, imageDetailData);
        return res;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const DeleteImageDetail = async (id) => {
    try {
        const res = await axios.delete(`ImageDetail/${id}`);
        return res;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}