import React, {useEffect, useState} from "react";
import axios from "../../api/axios";
import tinh_tp from "../../Models/Address/tinh-tp.json";
import quan_huyen from "../../Models/Address/quan-huyen.json";
import xa_phuong from "../../Models/Address/xa-phuong.json";

export default function OrderDetails({visible, orderData, handleAddOrder, handleEditOrder, onClose, action}) {
    const [order, setOrder] = useState(orderData);

    const [cities, setCities] = useState(tinh_tp);
    const [districts, setDistricts] = useState(quan_huyen);
    const [wards, setWards] = useState(xa_phuong);

    if (!visible) return null;
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1 mb-5">
                    <div className="text-3xl">Thông tin đơn hàng</div>
                    <button onClick={onClose}>X</button>
                </div>
                <div className="content">
                    <table className="col-span-3 form overflow-auto w-full">
                        <tbody>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="" htmlFor="id">
                                        ID
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control border border-black rounded-md w-4/5 mx-2`}
                                        id="id"
                                        // onChange={(e) => handleOnChange(e)}
                                        // onBlur={(e) => handleValidEmail(e)}
                                        // value={staff.email}
                                        // disabled={action === "detail"}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="" htmlFor="customerEmail">
                                        Email khách hàng(*)
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control border border-black rounded-md w-4/5 mx-2`}
                                        id="customerEmail"
                                        // onChange={(e) => handleOnChange(e)}
                                        // onBlur={(e) => handleValidEmail(e)}
                                        // value={staff.email}
                                        // disabled={action === "detail"}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="phone">
                                        Số điện thoại(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="phone"
                                        // onChange={(e) => handleOnChange(e)}
                                        // value={staff.phone}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={"2"}>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="" htmlFor="address">
                                        Địa chỉ(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md w-4/5 mx-2"
                                        id="address"
                                        // onChange={(e) => handleOnChange(e)}
                                        // value={staff.address}
                                    />
                                </div>
                            </td>
                            <td>
                                <label className="" htmlFor="totalPrice">
                                    Trị giá(*)
                                </label>
                                <input
                                    type="text"
                                    className="form-control border border-black rounded-md mx-2"
                                    id="totalPrice"
                                    // onChange={(e) => handleOnChange(e)}
                                    // value={staff.address}
                                />
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
                                        // onChange={(e) => handleOnChange(e)}
                                        defaultValue={"orderCity"}
                                    >
                                        <option
                                            id={"orderCity"}
                                            value={order.city}
                                        >
                                            {order.city}
                                        </option>
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
                                        // onChange={(e) => handleOnChange(e)}
                                        defaultValue={"orderDistrict"}
                                    >
                                        {(orderData.city === order.city) &&
                                            <option
                                                id={"orderDistrict"}
                                                value={order.district}
                                            >
                                                {order.district}
                                            </option>
                                        }
                                        {
                                            districts.map((quan) => (quan.parent_code === order.cityCode) && (
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
                                        // onChange={(e) => handleOnChange(e)}
                                        defaultValue={"orderWard"}
                                    >
                                        {(orderData.district === order.district && orderData.city === order.city) &&
                                            <option
                                                id={"orderWard"}
                                                value={order.ward}
                                            >
                                                {order.ward}
                                            </option>}
                                        {
                                            wards.map((ward) => (
                                                (ward.parent_code === order.districtCode) &&
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
                            
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}