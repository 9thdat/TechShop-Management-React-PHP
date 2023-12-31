import axios from '../../api/axios';

export const fetchOrders = async () => {
    try {
        const res = await axios.get("/Order/GetAllOrders.php");
        return res.data.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const AddOrder = async (orderData) => {
    try {
        const res = await axios.post("/Order/AddOrder.php", orderData);
        return res;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const UpdateOrder = async (orderData) => {
    try {
        const res = await axios.put(`/Order/ChangeStatus.php`, orderData);
        return res;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const fetchOrdersProcessing = async () => {
    try {
        const res = await axios.get("/Order/GetProcessingOrdersCount.php");
        return res.data.data;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

export const fetchOrdersTodayCompleted = async () => {
    try {
        const res = await axios.get("/Order/GetTodayCompleted.php");
        return res.data.data;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

export const fetchRevenueToday = async () => {
    try {
        const res = await axios.get("/Order/GetRevenueToday.php");
        return res.data.data;
    } catch (err) {
        console.log(err);
        return 0;
    }
}


export const fetchRevenueMonth = async () => {
    try {
        const res = await axios.get("/Order/GetRevenueThisMonth.php");
        return res.data.data;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

export const fetchRevenueEachDayThisMonth = async () => {
    try {
        const res = await axios.get("/Order/GetRevenueEachDayThisMonth.php");
        return res.data.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const fetchTop5Customers = async () => {
    try {
        const res = await axios.get("/Customer/GetTop5Customers.php");
        return res.data.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const fetchRevenue = async (startMonth, startYear, endMonth, endYear) => {
    try {
        const res = await axios.get(`/Order/GetMonthlyRevenue.php?startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}`);
        return res.data.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const fetchRevenueByProduct = async (startMonth, startYear, endMonth, endYear, productId) => {
    try {
        const res = await axios.get(`/Order/GetMonthlyRevenueByProduct.php?startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}&productId=${productId}`);
        return res.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const fetchProductsSold = async (startMonth, startYear, endMonth, endYear) => {
    try {
        const res = await axios.get(`/Order/GetMonthlyProductsSold.php?startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}`);
        return res.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}


export const fetchProductSold = async (startMonth, startYear, endMonth, endYear, productId) => {
    try {
        const res = await axios.get(`/Order/GetMonthlyProductsSold.php?startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}&productId=${productId}`);
        return res.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}


export const getLastId = async () => {
    try {
        const response = await axios.get("/Order/GetLastId.php");
        return response.data.data;
    } catch (e) {
        console.log(e);
    }
}