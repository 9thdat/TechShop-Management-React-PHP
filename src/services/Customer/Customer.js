import axios from '../../api/axios';

export const fetchCustomers = async () => {
    try {
        const response = await axios.get("/Customer/GetAllCustomers.php");
        return response.data.data || [];
    } catch (error) {
        console.log("Failed to fetch customer list: ", error.message);
        return [];
    }
}

export const fetchCustomer = async (email) => {
    try {
        const response = await axios.get(`/Customer/GetCustomerByEmail.php?email=${email}`);
        return response.data;
    } catch (e) {
        console.log(e);
    }
}

export const AddCustomer = async (newCustomer) => {
    try {
        const res = await axios.post("/Customer/CreateCustomer.php", newCustomer);
        return res.data;
    } catch (error) {
        console.log("Thêm khách hàng thất bại: ", error.message);
    }
}

export const changeCustomerStatus = async (email) => {
    try {
        const response = await axios.put(`/Customer/ChangeStatus.php?Email=${email}`);
        return response.data;
    } catch (error) {
        return error.response;
    }
}

