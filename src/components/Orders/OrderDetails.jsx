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

    useEffect(() => {
        if (action === "add") {
            setOrder({
                id: "",
                customerEmail: "",
                name: "",
                address: "",
                phone: "",
                discountId: "",
                shippingFee: "",
                totalPrice: "",
                note: "",
                orderDate: "",
                cancelDate: "",
                completeDate: "",
                deleveryType: "",
                paymentType: "",
                status: "",
            });
        } else {
            setOrder(orderData);
        }
    }, [orderData]);

    useEffect(() => {
        console.log(order);
    }, [order]);

    const handleOnChange = (e) => {
        const {id, value} = e.target;
        setOrder({...order, [id]: value});
    }

    const handleOnSaveOrder = () => {
        if (action === "add") {
            handleAddOrder(order);
        } else {
            handleEditOrder(order);
        }
    }

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
                                        onChange={(e) => handleOnChange(e)}
                                        // onBlur={(e) => handleValidEmail(e)}
                                        value={order.id}
                                        disabled={true}
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
                                        className={`form-control border border-black rounded-md w-3/5 mx-2`}
                                        id="customerEmail"
                                        onChange={(e) => handleOnChange(e)}
                                        // onBlur={(e) => handleValidEmail(e)}
                                        value={order.customerEmail}
                                        // disabled={action === "detail"}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="name">
                                        Tên khách hàng(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="phone"
                                        onChange={(e) => handleOnChange(e)}
                                        value={order.name}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={"1"}>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="" htmlFor="address">
                                        Địa chỉ(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md w-4/5 mx-2"
                                        id="address"
                                        onChange={(e) => handleOnChange(e)}
                                        value={order.address}
                                    />
                                </div>
                            </td>
                            <td>
                                <label className="" htmlFor="phone">
                                    Số điện thoại(*)
                                </label>
                                <input
                                    type="text"
                                    className="form-control border border-black rounded-md mx-2"
                                    id="phone"
                                    onChange={(e) => handleOnChange(e)}
                                    value={order.phone}
                                />
                            </td>
                            <td>
                                <label className="" htmlFor="totalPrice">
                                    Tổng tiền(*)
                                </label>
                                <input
                                    type="text"
                                    className="form-control border border-black rounded-md mx-2"
                                    id="totalPrice"
                                    onChange={(e) => handleOnChange(e)}
                                    value={order.totalPrice}
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
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="orderDate">
                                        Ngày đặt hàng(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="orderDate"
                                        onChange={(e) => handleOnChange(e)}
                                        value={order.orderDate}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="shippingFee">
                                        Phí vận chuyển
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="shippingFee"
                                        onChange={(e) => handleOnChange(e)}
                                        value={order.shippingFee}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="discountId">
                                        Mã giảm giá
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="discountId"
                                        onChange={(e) => handleOnChange(e)}
                                        value={order.discountId}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="paymentType">
                                        Hình thức thanh toán(*)
                                    </label>
                                    <select
                                        name={"paymentType"}
                                        id={"paymentType"}
                                        className="form-control border border-black rounded-md mx-2"
                                        // onChange={(e) => handleOnChange(e)}
                                        defaultValue={"orderPaymentType"}
                                    >
                                        <option
                                            id={"orderPaymentType"}
                                            value={order.paymentType}
                                        >
                                            {order.paymentType}
                                        </option>
                                        <option value={"Credit Card"}>Credit Card</option>
                                        <option value={"PayPal"}>PayPal</option>
                                        <option value={"Cash"}>Cash</option>
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="deleveryType">
                                        Hình thức giao hàng(*)
                                    </label>
                                    <select
                                        name={"deleveryType"}
                                        id={"deleveryType"}
                                        className="form-control border border-black rounded-md mx-2"
                                        // onChange={(e) => handleOnChange(e)}
                                        defaultValue={"orderDeleveryType"}
                                    >
                                        <option
                                            id={"orderDeleveryType"}
                                            value={order.deleveryType}
                                        >
                                            {order.deleveryType}
                                        </option>
                                        <option value={"Standard"}>Standard</option>
                                        <option value={"Express"}>Express</option>
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="status">
                                        Trạng thái(*)
                                    </label>
                                    <select
                                        name={"status"}
                                        id={"status"}
                                        className="form-control border border-black rounded-md mx-2"
                                        // onChange={(e) => handleOnChange(e)}
                                        defaultValue={"orderStatus"}
                                    >
                                        <option
                                            id={"orderStatus"}
                                            value={order.status}
                                        >
                                            {order.status}
                                        </option>
                                        <option value={"Processing"}>Đang xử lý</option>
                                        <option value={"Delivering"}>Đang giao</option>
                                        <option value={"Done"}>Đã giao</option>
                                        <option value={"Cancelled"}>Đã hủy</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={"1"}>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="note">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="note"
                                        onChange={(e) => handleOnChange(e)}
                                        value={order.note}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={"3"}>
                                <button className="px-2 py-1 ml-2 text-white bg-blue-500 rounded-md"
                                        onClick={handleOnSaveOrder}
                                >
                                    Lưu
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}