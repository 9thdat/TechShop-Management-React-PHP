import React, {useState, useEffect} from "react";
import axios from "../../api/axios";

const tinh_tp = require("../../Models/Address/tinh-tp.json");
const quan_huyen = require("../../Models/Address/quan-huyen.json");
const xa_phuong = require("../../Models/Address/xa-phuong.json");

export default function CustomerDetail({visible, onClose, customerData}) {
    const [customer, setCustomer] = useState({});

    const [selectedAddress, setSelectedAddress] = useState({
        street: "",
        city: "",
        cityCode: "",
        district: "",
        districtCode: "",
        ward: "",
    });

    useEffect(() => {
        setCustomer(customerData);
    }, [customerData]);

    const handleOnChange = (e) => {
        if (e.target.id === "city") {
            // Update selected city and reset district and ward
            setSelectedAddress((prevAddress) => ({
                ...prevAddress,
                city: e.target.value,
                cityCode: e.target.key,
                district: "",
                districtCode: "",
                ward: "",
            }));
        } else if (e.target.id === "district") {
            // Update selected district and reset ward
            setSelectedAddress((prevAddress) => ({
                ...prevAddress,
                district: e.target.value,
                districtCode: e.target.key,
                ward: "",
            }));
        } else {
            // Update other fields
            setCustomer((prevCustomer) => ({
                ...prevCustomer,
                [e.target.id]: e.target.value,
            }));
        }
        console.log(selectedAddress);
    };


    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Thông tin khách hàng</div>
                    <button onClick={onClose}>X</button>
                </div>
                <div className="content">
                    <table className="col-span-3 form overflow-auto">
                        <tbody>
                        <tr>
                            <div className="form-group flex justify-between mb-4 ">
                                <label className="mr-2" htmlFor="id">Email</label>
                                <input type="text"
                                       className="form-control border border-black rounded-md disabled:bg-slate-200"
                                       id="email"
                                       onChange={(e) => handleOnChange(e)}
                                       value={customer.email}/>
                            </div>
                        </tr>
                        <tr>
                            <div className="form-group flex justify-between mb-4 ">
                                <label className="mr-2" htmlFor="name">Tên</label>
                                <input type="text"
                                       className="form-control border border-black rounded-md"
                                       id="name"
                                       onChange={(e) => handleOnChange(e)}
                                       value={customer.name}/>
                            </div>
                        </tr>
                        <tr>
                            <div className="form-group flex justify-between mb-4 ">
                                <label className="mr-2" htmlFor="phone">Password</label>
                                <input type="password"
                                       className="form-control border border-black rounded-md"
                                       id="password"
                                       onChange={(e) => handleOnChange(e)}
                                       value={customer.password}/>
                            </div>
                        </tr>
                        <tr>
                            <div className="form-group flex justify-between mb-4 ">
                                <label className="mr-2" htmlFor="phone">Số điện thoại</label>
                                <input type="text"
                                       className="form-control border border-black rounded-md"
                                       id="phone"
                                       onChange={(e) => handleOnChange(e)}
                                       value={customer.phone}/>
                            </div>
                        </tr>
                        <tr>
                            <div className="form-group flex justify-between mb-4 ">
                                <label className="mr-2" htmlFor="gender">Giới tính</label>
                                <select name={"gender"} id={"gender"}
                                        className="form-control border border-black rounded-md">
                                    <option value={"Nam"}>Nam</option>
                                    <option value={"Nữ"}>Nữ</option>
                                </select>
                            </div>
                        </tr>
                        <tr>
                            <div className="form-group flex justify-between mb-4 ">
                                <label className="mr-2" htmlFor="birthday">Ngày sinh</label>
                                <input type="date"
                                       className="form-control border border-black rounded-md"
                                       id="birthday"
                                       onChange={(e) => handleOnChange(e)}
                                       value={customer.birthday}/>
                            </div>
                        </tr>
                        <tr>
                            <div className="form-group flex justify-between mb-4 ">
                                <label className="mr-2" htmlFor="address">Địa chỉ</label>

                                <input type="text"
                                       className="form-control border border-black rounded-md"
                                       id="address"
                                       onChange={(e) => handleOnChange(e)}
                                       value={selectedAddress.street}
                                />

                                <select name={"city"}
                                        id={"city"}
                                        onChange={(e) => handleOnChange(e)}
                                        value={selectedAddress.city}
                                        key={selectedAddress.cityCode}
                                >
                                    {tinh_tp &&
                                        Object.values(tinh_tp).map((tinh) => (
                                            <option key={tinh.code} value={tinh.name}>
                                                {tinh.name}
                                            </option>
                                        ))
                                    }
                                </select>

                                <select
                                    name={"district"}
                                    id={"district"}
                                    onChange={(e) => handleOnChange(e)}
                                    value={selectedAddress.district}
                                    key={selectedAddress.districtCode}
                                >
                                    {quan_huyen &&
                                        Object.values(quan_huyen)
                                            .filter((quan) => selectedAddress.cityCode === quan.parent_code)
                                            .map((quan) => (
                                                <option key={quan.code} value={quan.name}>
                                                    {quan.name}
                                                </option>
                                            ))}
                                </select>

                                <select
                                    name={"ward"}
                                    id={"ward"}
                                    onChange={(e) => handleOnChange(e)}
                                    value={selectedAddress.ward}
                                >
                                    {xa_phuong &&
                                        Object.values(xa_phuong)
                                            .filter((xa) => selectedAddress.districtCode === xa.parent_code)
                                            .map((xa) => (
                                                <option key={xa.code} value={xa.name}>
                                                    {xa.name}
                                                </option>
                                            ))}
                                </select>

                            </div>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}