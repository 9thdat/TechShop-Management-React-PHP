import axios from '../../api/axios';


export const fetchProductBackupCharger = async (productId) => {
    try {
        const productBackupChargerResponse = await axios.get(`/ParameterBackupCharger/ProductId=${productId}`);
        return productBackupChargerResponse.data.length > 0 ? productBackupChargerResponse.data[0] : {};
    } catch (error) {
        console.log("Failed to fetch product backup charger list: ", error.message);
        return {};
    }
};

export const AddProductBackupCharger = async (data) => {
    try {
        const res = await axios.post('/ParameterBackupCharger', data);
        return res;
    } catch (err) {
        return err.response;
    }
}

export const UpdateProductBackupCharger = async (data) => {
    try {
        const res = await axios.put(`/ParameterBackupCharger/${data.id}`, data);
        return res;
    } catch (err) {
        return err.response;
    }
}

export const DeleteProductBackupCharger = async (id) => {
    try {
        const res = await axios.delete(`/ParameterBackupCharger/${id}`);
        return res;
    } catch (err) {
        return err.response;
    }
}