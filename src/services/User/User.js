import axios from '../../api/axios';

export const fetchUser = async (email) => {
    try {
        const res = await axios.get(`/User/GetStaff.php?email=${email}`);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

export const fetchStaffs = async () => {
    try {
        const res = await axios.get("/User/GetStaffs.php");
        return res.data.data;
    } catch (err) {
        console.log(err);
    }
}

export const AddStaff = async (staff) => {
    try {
        const res = await axios.post("/User/CreateStaff.php", staff);
        return res.data;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const UpdateStaff = async (staff) => {
    try {
        const res = await axios.put("/User/UpdateStaff.php", staff);
        return res.data;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const ValidateStaff = async (email) => {
    try {
        const res = await axios.get(`/User/IsEmailStaffExist.php?email=${email}`);
        return res.data;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const Login = async (email, password) => {
    try {
        const res = await axios.post(`/User/Login.php`, {
            email: email,
            password: password,
        });
        return res;
    } catch (e) {
        console.log(e);
    if(e.response.status === 404){
            alert("Người dùng không tồn tại");
        }
        else if(e.response.status  === 401){
            alert("Sai mật khẩu");
        }
        else{
            alert("Lỗi không xác định");
        }
    }
}

export const ValidateToken = async (token) => {
    try {
        const res = await axios.post("/User/ValidateToken.php", {
            token: token,
        });
        return res;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}

export const ChangePassword = async (email, password) => {
    try {
        const res = await axios.put(`/User/ChangePassword.php?email=${email}`, {
            password: password,
        });
        return res.data;
    } catch (e) {
        console.log(e);
        return (e.res);
    }
}