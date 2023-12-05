import React, {useState, useEffect, useMemo} from "react";
import axios from "../../api/axios";

const tinh_tp = require("../../Models/Address/tinh-tp.json");
const quan_huyen = require("../../Models/Address/quan-huyen.json");
const xa_phuong = require("../../Models/Address/xa-phuong.json");

export default function CustomerDetail({visible, onClose, customerData, action}) {
    const [customer, setCustomer] = useState();

    const [cities, setCities] = useState();
    const [districts, setDistricts] = useState();
    const [wards, setWards] = useState();

    const cityList = Object.keys(tinh_tp).map((tinh) => { // List of provinces
        return {
            name: tinh_tp[tinh].name,
            code: tinh_tp[tinh].code
        };
    });

    const districtList = Object.keys(quan_huyen).map((quan) => {
        return {
            name: quan_huyen[quan].name,
            code: quan_huyen[quan].code,
            parent_code: quan_huyen[quan].parent_code
        };
    });

    const wardList = Object.keys(xa_phuong).map((xa) => {
            return {
                name: xa_phuong[xa].name,
                code: xa_phuong[xa].code,
                parent_code: xa_phuong[xa].parent_code
            };
        }
    );

    const [selectedAddress, setSelectedAddress] = useState({
        street: "",
        city: cityList[0].name,
        cityCode: cityList[0].code,
        district: districtList[0].name,
        districtCode: districtList[0].code,
        ward: wardList[0].name,
    });

    useEffect(() => { // Set customer data
        setCustomer(customerData);
        console.log(customer);
    }, [customerData]);

    useEffect(() => { // Set citys
        setCities(cityList);
    }, []);

    useEffect(() => {
        setDistricts(districtList.filter((quan) => quan.parent_code === selectedAddress.cityCode));
    }, [selectedAddress.cityCode]);

    useEffect(() => {
        setWards(wardList.filter((xa) => xa.parent_code === selectedAddress.districtCode));
    }, [selectedAddress.districtCode, selectedAddress.cityCode]);

    const handleOnChange = (e) => {
        const {id, value} = e.target;

        if (id === "city") {
            setSelectedAddress({
                    ...selectedAddress,
                    cityCode: cityList.find((tinh) => tinh.name === value).code,
                    districtCode: districtList.find((quan) => quan.parent_code === cityList.find((tinh) => tinh.name === value).code).code,
                }
            );
        } else if (id === "district") {
            setSelectedAddress({
                ...selectedAddress,
                districtCode: districtList.find((quan) => quan.name === value).code,
            });
        } else if (id === "image") {
            const reader = new FileReader();

            reader.onload = (e) => {
                setCustomer({
                    ...customer,
                    image: e.target.result
                });
            };

            reader.readAsDataURL(e.target.files[0]);
        } else {
            setSelectedAddress(
                {
                    ...selectedAddress,
                    [id]: value,
                }
            )
            setCustomer({
                ...customer,
                [id]: value,
            });
        }
        console.log(id);
        console.log(value);
    };


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
                            <td colSpan={2}>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="" htmlFor="id">
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md w-4/5 mx-2"
                                        id="email"
                                        onChange={(e) => handleOnChange(e)}
                                        value={customer.email}
                                        disabled={action === "detail"}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="name">
                                        Tên
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="name"
                                        onChange={(e) => handleOnChange(e)}
                                        value={customer.name}
                                        disabled={action === "detail"}
                                    />
                                </div>
                            </td>

                        </tr>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="phone">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="phone"
                                        onChange={(e) => handleOnChange(e)}
                                        value={customer.phone}
                                        disabled={action === "detail"}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="gender">
                                        Giới tính
                                    </label>
                                    <select
                                        name={"gender"}
                                        id={"gender"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        disabled={action === "detail"}
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
                                    <label className="" htmlFor="street">
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md w-4/5 mx-2"
                                        id="street"
                                        onChange={(e) => handleOnChange(e)}
                                        value={customer.address}
                                        disabled={action === "detail"}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="address">
                                        Tình trạng
                                    </label>
                                    <select
                                        name={"status"}
                                        id={"status"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        disabled={action === "detail"}
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
                                    <label className="" htmlFor="address">
                                        Tỉnh/Thành phố
                                    </label>
                                    <select
                                        name={"city"}
                                        id={"city"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        disabled={action === "detail"}
                                    >
                                        {(action === "add") ? (
                                            cities.map((tinh) => (
                                                <option key={tinh.code} value={tinh.name}>
                                                    {tinh.name}
                                                </option>
                                            ))
                                        ) : (
                                            <option value={customer.city}>
                                                {customer.city}
                                            </option>
                                        )}
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">

                                    <label className="m" htmlFor="address">
                                        Quận/Huyện
                                    </label>
                                    <select
                                        name={"district"}
                                        id={"district"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        disabled={action === "detail"}
                                    >
                                        {
                                            (action === "add") ? (
                                                districts &&
                                                districts.map((quan) => (
                                                    <option key={quan.code} value={quan.name}>
                                                        {quan.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value={customer.district}>
                                                    {customer.district}
                                                </option>
                                            )
                                        }
                                    </select>

                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="address">
                                        Xã/Phường
                                    </label>
                                    <select
                                        name={"ward"}
                                        id={"ward"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        value={selectedAddress.ward}
                                        disabled={action === "detail"}
                                    >
                                        {
                                            (action === "add") ? (
                                                wards &&
                                                wards.map((xa) => (
                                                    <option key={xa.code} value={xa.name}>
                                                        {xa.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value={customer.ward}>
                                                    {customer.ward}
                                                </option>
                                            )
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
                                    className={"w-32 h-32"}
                                    src={`data:image/jpeg;base64, ${customer.image}`}
                                    alt={customer.name}
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}