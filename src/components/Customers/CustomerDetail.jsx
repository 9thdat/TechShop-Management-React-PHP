import React, {useState, useEffect, useMemo} from "react";
import axios from "../../api/axios";
import defaultAvatar from "../../assets/images/defaultAvatar/defaultAvatar.jpeg"

const tinh_tp = require("../../Models/Address/tinh-tp.json");
const quan_huyen = require("../../Models/Address/quan-huyen.json");
const xa_phuong = require("../../Models/Address/xa-phuong.json");

export default function CustomerDetail({visible, onClose, customerData, action, addCustomer}) {
    const defaultCustomer = {
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
    };
    const [customer, setCustomer] = useState({...defaultCustomer, ...customerData});

    const [cities, setCities] = useState(tinh_tp);
    const [districts, setDistricts] = useState(quan_huyen);
    const [wards, setWards] = useState(xa_phuong);

    const [isValid, setIsValid] = useState({
        email: false,
        password: false,
        name: false,
        address: false,
        phone: false,
        newEmail: true,
        newPassword: true,
        newName: true,
        newAddress: true,
        newPhone: true,
    });

    const [isCustomerExist, setIsCustomerExist] = useState(false);

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

            setIsValid({
                email: false,
                password: false,
                name: false,
                address: false,
                phone: false,
                newEmail: true,
                newPassword: true,
                newName: true,
                newAddress: true,
                newPhone: true,
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

            setIsValid({
                email: true,
                password: true,
                name: true,
                address: true,
                phone: true,
                newEmail: true,
                newPassword: true,
                newName: true,
                newAddress: true,
                newPhone: true,
            });
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

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleValidEmail = async (e) => {
        const value = e.target.value;
        const isValid = isValidEmail(value);
        setIsValid((prevIsValid) => ({
            ...prevIsValid,
            newEmail: false,
            email: isValid,
        }));
        if (!isValid) {
            return;
        }
        try {
            const res = await axios.get(`/Customer/${e.target.value}`);
            if (res.status === 200) {
                setIsCustomerExist(true);
            }
        } catch (e) {
            setIsCustomerExist(false);
        }
    }

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        if (!isValid.email || !isValid.password || !isValid.name || !isValid.address || !isValid.phone || isCustomerExist) {
            alert("Vui lòng nhập đúng thông tin!");
            return;
        }

        if (customer.image !== "") {
            customer.image = customer.image.split(',')[1];
        } else {
            customer.image = "";
        }

        addCustomer(customer);
    }

    const handleValidField = (e) => {
        const {id, value} = e.target;
        console.log(id, value);

        setIsValid({
            ...isValid,
            [id]: value !== "",
        })

        const fields = ["email", "password", "name", "address", "phone"];
        fields.forEach(field => {
            if (id === field && isValid[`new${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
                setIsValid({
                    ...isValid,
                    [`new${field.charAt(0).toUpperCase() + field.slice(1)}`]: false,
                })
            }
        });
    };


    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm"
        >
            <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                    <div className="text-2xl">Thông tin khách hàng</div>
                    <button onClick={onClose}>X</button>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div className="">
                        <label className="" htmlFor="id">
                            Email(*)
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300 ${(isValid.newEmail) ? "" : (isValid.email) ? ((isCustomerExist) ? "border-red-500" : "") : "border-red-500"}`}
                            id="email"
                            onChange={(e) => handleOnChange(e)}
                            onBlur={(e) => handleValidEmail(e)}
                            value={customer.email}
                            disabled={action === "detail"}
                        />
                        {
                            (isCustomerExist) && (
                                <h5 className="text-red-300 text-xs">"Email đã tồn tại"</h5>
                            )}
                        {
                            (!isValid.email && !isValid.newEmail) && (
                                <h5 className="text-red-300 text-xs">"Email không hợp lệ"</h5>
                            )
                        }
                    </div>
                    <div className="">
                        <label className="" htmlFor="password">
                            Mật khẩu(*)
                        </label>
                        <input
                            type="password"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300 ${(isValid.newPassword) ? "" : (isValid.password) ? "" : "border-red-500"}`}
                            id="password"
                            onChange={(e) => handleOnChange(e)}
                            onBlur={(e) => handleValidField(e)}
                            value={customer.password}
                            disabled={action === "detail"}
                        />
                        {
                            (!isValid.password && !isValid.newPassword) && (
                                <h5 className="text-red-300 text-xs">"Mật khẩu không hợp lệ"</h5>
                            )
                        }
                    </div>
                    <div className="">
                        <label className="" htmlFor="name">
                            Tên(*)
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300 ${(isValid.newName) ? "" : (isValid.name) ? "" : "border-red-500"}`}
                            id="name"
                            onChange={(e) => handleOnChange(e)}
                            onBlur={(e) => handleValidField(e)}
                            value={customer.name}
                            disabled={action === "detail"}
                        />
                        {
                            (!isValid.name && !isValid.newName) && (
                                <h5 className="text-red-300 text-xs">"Tên không hợp lệ"</h5>
                            )
                        }
                    </div>
                    <div className="">
                        <label className="" htmlFor="phone">
                            Số điện thoại(*)
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300 ${(isValid.newPhone) ? "" : (isValid.phone) ? "" : "border-red-500"}`}
                            id="phone"
                            onChange={(e) => handleOnChange(e)}
                            onBlur={(e) => handleValidField(e)}
                            value={customer.phone}
                            disabled={action === "detail"}
                        />
                        {
                            (!isValid.phone && !isValid.newPhone) && (
                                <h5 className="text-red-300 text-xs">"Số điện thoại không hợp lệ"</h5>
                            )
                        }
                    </div>
                    <div className="">
                        <label className="" htmlFor="gender">
                            Giới tính
                        </label>
                        <select
                            name={"gender"}
                            id={"gender"}
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            onChange={(e) => handleOnChange(e)}
                            disabled={action === "detail"}
                            value={customer.gender}
                        >
                            <option value={"Nam"}>Nam</option>
                            <option value={"Nữ"}>Nữ</option>
                        </select>
                    </div>
                    <div className="">
                        <label className="" htmlFor="birthday">
                            Ngày sinh
                        </label>
                        <input
                            type="date"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="birthday"
                            onChange={(e) => handleOnChange(e)}
                            value={customer.birthday}
                            disabled={action === "detail"}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor="address">
                            Địa chỉ(*)
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300 ${(isValid.newAddress) ? "" : (isValid.address) ? "" : "border-red-500"}`}
                            id="address"
                            onChange={(e) => handleOnChange(e)}
                            value={customer.address}
                            onBlur={(e) => handleValidField(e)}
                            disabled={action === "detail"}
                        />
                        {
                            (!isValid.address && !isValid.newAddress) && (
                                <h5 className="text-red-300 text-xs">"Địa chỉ không hợp lệ"</h5>
                            )
                        }
                    </div>
                    <div className="">
                        <label className="" htmlFor="address">
                            Tình trạng
                        </label>
                        <select
                            name={"status"}
                            id={"status"}
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            onChange={(e) => handleOnChange(e)}
                            disabled={action === "detail"}
                            value={customer.status}
                        >
                            <option value={"active"}>Hoạt động</option>
                            <option value={"inactive"}>Không hoạt động</option>
                        </select>
                    </div>
                    <div className="">
                        <label className="" htmlFor="city">
                            Tỉnh/Thành phố
                        </label>
                        <select
                            name={"city"}
                            id={"city"}
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
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
                    <div className="">
                        <label className="m" htmlFor={"district"}>
                            Quận/Huyện
                        </label>
                        <select
                            name={"district"}
                            id={"district"}
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
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
                    <div className="">
                        <label className="" htmlFor="ward">
                            Xã/Phường
                        </label>
                        <select
                            name={"ward"}
                            id={"ward"}
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
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
                    <div className={"col-span-2"}>
                        <label className="" htmlFor="image">
                            Ảnh đại diện
                        </label>
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
                    </div>
                    <div className={"col-span-2 flex justify-end"}>
                        {
                            action === "add" ? (
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="image"
                                        onChange={(e) => handleOnChange(e)}
                                    />
                                )
                                : ("")
                        }
                    </div>
                    <div className={"col-span-2 flex justify-end"}>
                        {
                            action === "add" ? (
                                <button
                                    className="px-2 py-1 text-white bg-blue-500 rounded-md"
                                    onClick={(e) => handleAddCustomer(e)}>Lưu
                                </button>
                            ) : ("")
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
