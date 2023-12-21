import React, {useState, useEffect, useMemo} from "react";
import axios from "../../api/axios";
import defaultAvatar from "../../assets/images/defaultAvatar/defaultAvatar.jpeg"

const tinh_tp = require("../../Models/Address/tinh-tp.json");
const quan_huyen = require("../../Models/Address/quan-huyen.json");
const xa_phuong = require("../../Models/Address/xa-phuong.json");

export default function CustomerDetail({visible, onClose, customerData, action, addCustomer}) {
    const [customer, setCustomer] = useState(customerData);

    const [cities, setCities] = useState(tinh_tp);
    const [districts, setDistricts] = useState(quan_huyen);
    const [wards, setWards] = useState(xa_phuong);

    useEffect(() => { // Set customer data
        if (action === "add") {
            setCustomer({
                email: "",
                name: "",
                password: "",
                phone: "",
                gender: "Nam",
                birthday: new Date().toISOString().split('T')[0],
                address: "",
                ward: "Phường Tân Định",
                district: "Quận 1",
                city: "Thành phố Hồ Chí Minh",
                image: "",
                status: "active",
                cityCode: 79,
                districtCode: 760,
            });
        } else {
            const newCity = cities.find((tinh) => tinh.name === customerData.city);
            const newDistrict = districts.find((quan) => quan.parent_code === newCity?.code);
            setCustomer(
                {
                    ...customerData,
                    cityCode: newCity?.code,
                    districtCode: newDistrict?.code,
                }
            );
        }
    }, [customerData]);

    const handleOnChange = (e) => {
        const {id, value} = e.target;

        if (id === "city") {
            const newCity = cities.find((tinh) => tinh.name === value);
            const newDistrict = districts.find((quan) => quan.parent_code === newCity?.code);
            const newWard = wards.find((xa) => xa.parent_code === newDistrict?.code);

            setCustomer((prevCustomer) => ({
                ...prevCustomer,
                city: value,
                cityCode: newCity?.code,
                districtCode: newDistrict?.code,
                district: newDistrict?.name,
                ward: newWard?.name,
            }));
        } else if (id === "district") {
            const newDistrict = districts.find((quan) => quan.name === value);
            const newWard = wards.find((xa) => xa.parent_code === newDistrict?.code);

            setCustomer((prevCustomer) => ({
                ...prevCustomer,
                district: value,
                districtCode: newDistrict?.code,
                ward: newWard?.name,
            }));
        } else if (id === "image") {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setCustomer({
                        ...customer,
                        image: reader.result,
                    });
                }
            }
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setCustomer({
                ...customer,
                [id]: value,
            });
        }
    };

    const handleValidEmail = async (e) => {
        try {
            const res = await axios.get(`/Customer/${e.target.value}`);

            if (res.status === 200) {
                alert("Email đã tồn tại!");
            }
        } catch (e) {

        }
    }

    const handleAddCustomer = async (e) => {
        e.preventDefault();

        if (customer.image !== "") {
            customer.image = customer.image.split(',')[1];
        } else {
            customer.image = "";
        }

        addCustomer(customer);
    }

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1 mb-5">
                    <div className="text-3xl">Thông tin khách hàng</div>
                    <button onClick={onClose}>X</button>
                </div>
                <div className="content">
                    <table className="col-span-3 form overflow-auto w-full">
                        <tbody>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="" htmlFor="id">
                                        Email(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md w-4/5 mx-2"
                                        id="email"
                                        onChange={(e) => handleOnChange(e)}
                                        onBlur={(e) => handleValidEmail(e)}
                                        value={customer.email}
                                        disabled={action === "detail"}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="name">
                                        Tên(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="name"
                                        onChange={(e) => handleOnChange(e)}
                                        value={customer.name}
                                        required={true}
                                        disabled={action === "detail"}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="password">
                                        Mật khẩu(*)
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="password"
                                        onChange={(e) => handleOnChange(e)}
                                        value={customer.password}
                                        required={true}
                                        disabled={action === "detail"}
                                    />
                                </div>
                            </td>

                        </tr>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="phone">
                                        Số điện thoại(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="phone"
                                        onChange={(e) => handleOnChange(e)}
                                        value={customer.phone}
                                        required={true}
                                        disabled={action === "detail"}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="gender">
                                        Giới tính(*)
                                    </label>
                                    <select
                                        name={"gender"}
                                        id={"gender"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        disabled={action === "detail"}
                                        value={customer.gender}
                                    >
                                        <option value={"Nam"}>Nam</option>
                                        <option value={"Nữ"}>Nữ</option>
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="birthday">
                                        Ngày sinh
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="birthday"
                                        onChange={(e) => handleOnChange(e)}
                                        value={customer.birthday}
                                        disabled={action === "detail"}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <div className="form-group flex justify-between mb-4">
                                    <label className="" htmlFor="address">
                                        Địa chỉ(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md w-4/5 mx-2"
                                        id="address"
                                        onChange={(e) => handleOnChange(e)}
                                        value={customer.address}
                                        required={true}
                                        disabled={action === "detail"}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="address">
                                        Tình trạng(*)
                                    </label>
                                    <select
                                        name={"status"}
                                        id={"status"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        disabled={action === "detail"}
                                        value={customer.status}
                                    >
                                        <option value={"active"}>Hoạt động</option>
                                        <option value={"inactive"}>Không hoạt động</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="city">
                                        Tỉnh/Thành phố(*)
                                    </label>
                                    <select
                                        name={"city"}
                                        id={"city"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        value={customer.city}
                                        disabled={action === "detail"}
                                    >
                                        {
                                            cities.map((tinh) => (
                                                <option value={tinh.name}
                                                        key={tinh.code}
                                                >
                                                    {tinh.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="m" htmlFor={"district"}>
                                        Quận/Huyện(*)
                                    </label>
                                    <select
                                        name={"district"}
                                        id={"district"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        value={customer.district}
                                        disabled={action === "detail"}
                                    >
                                        {
                                            districts.map((quan) => (quan.parent_code === customer.cityCode) && (
                                                <option key={quan.code}
                                                        value={quan.name}
                                                >
                                                    {quan.name}
                                                </option>
                                            ))
                                        }
                                    </select>

                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="ward">
                                        Xã/Phường(*)
                                    </label>
                                    <select
                                        name={"ward"}
                                        id={"ward"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        value={customer.ward}
                                        disabled={action === "detail"}
                                    >
                                        {
                                            wards.map((ward) => (
                                                (ward.parent_code === customer.districtCode) &&
                                                <option key={ward.code}
                                                        value={ward.name}
                                                >
                                                    {ward.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="" htmlFor="image">
                                    Ảnh đại diện
                                </label>
                            </td>
                            <td>
                                <img
                                    src={
                                        action === "detail" ?
                                            customer.image ? `data:image/jpeg;base64, ${customer.image}` : defaultAvatar
                                            :
                                            customer.image ? customer.image : defaultAvatar
                                    }
                                    alt="avatar"
                                    className="w-24 h-24 rounded-full mx-auto"
                                />


                            </td>
                            <td>
                                {
                                    action === "add" ? (
                                            <input
                                                type="file"
                                                className="form-control border border-black rounded-md mx-2"
                                                id="image"
                                                onChange={(e) => handleOnChange(e)}
                                            />
                                        )
                                        : ("")
                                }
                            </td>
                        </tr>
                        {
                            action === "add" ? (
                                <tr>
                                    <td>
                                        <button
                                            className="px-2 py-1 ml-2 text-white bg-blue-500 rounded-md"
                                            onClick={(e) => handleAddCustomer(e)}>Lưu
                                        </button>
                                    </td>
                                </tr>
                            ) : ("")
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
