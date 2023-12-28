import axios from '../../api/axios';

export const fetchCustomers = async () => {
    try {
        const response = await axios.get("/Customer");
        return response.data;
    } catch (error) {
        console.log("Failed to fetch customer list: ", error.message);
        return [];
    }
}

export const fetchCustomer = async (email) => {
    try {
        const response = await axios.get(`/Customer/${email}`);
        return response;
    } catch (e) {
        console.log(e);
    }
}

export const AddCustomer = async (newCustomer) => {
    try {
        const res = await axios.post("/Customer", newCustomer);
        return res;
    } catch (error) {
        console.log("Thêm khách hàng thất bại: ", error.message);
    }
}

export const changeCustomerStatus = async (email) => {
    try {
        const response = await axios.put(`Customer/ChangeStatus/Email=${email}`);
        return response;
    } catch (error) {
        alert("Đổi tình trạng thất bại!");
    }
}

export const getCustomerByEmail = async (email) => {
    try {
        const res = await axios.get(`/Customer/${email}`);
        return res;
    } catch (error) {
        console.log("Lỗi tìm khách hàng theo email: ", error.message);
    }
}

