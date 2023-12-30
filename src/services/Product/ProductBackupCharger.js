import axios from '../../api/axios';


export const fetchProductBackupCharger = async (productId) => {
    try {
        const productBackupChargerResponse = await axios.get(`/ParameterBackupcharger/GetParameterBackupcharger.php?ProductId=${productId}`);
        return productBackupChargerResponse.data.length > 0 ? productBackupChargerResponse.data[0] : {};
    } catch (error) {
        console.log("Failed to fetch product backup charger list: ", error.message);
        return {};
    }
};

export const AddProductBackupCharger = async (data) => {
    try {
        const res = await axios.post('/ParameterBackupcharger/AddParameterBackupcharger.php', data);
        return res;
    } catch (err) {
        return err.response;
    }
}

export const UpdateProductBackupCharger = async (data) => {
    try {
        const res = await axios.put(`/PParameterBackupcharger/UpdateParameterBackupcharger.php?id=${data.id}`, data);
        return res;
    } catch (err) {
        return err.response;
    }
}

export const DeleteProductBackupCharger = async (id) => {
    try {
        const res = await axios.delete(`/ParameterBackupcharger/DeleteParameterBackupcharger.php?id=${id}`);
        return res;
    } catch (err) {
        return err.response;
    }
}