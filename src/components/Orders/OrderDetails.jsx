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
            getLastId().then((res) => {
                    setOrder((prevOrder) => ({
                        ...prevOrder,
                        id: res,
                    }));
                }
            );

            setOrder({
                customerEmail: "",
                name: "",
                address: "",
                phone: "",
                discountId: "",
                shippingFee: "",
                totalPrice: "",
                note: "",
                orderDate: new Date().toISOString().split('T')[0],
                cancelDate: "",
                completeDate: "",
                deliveryType: "",
                paymentType: "",
                status: "Processing",
                city: "Tỉnh Lào Cai",
                district: "Thành phố Lào Cai",
                ward: "Xã Mường Pồn",
                cityCode: "10",
                districtCode: "080",
            });
        } else {
            setOrder((prevOrder) => {
                const newCity = cities.find((tinh) => tinh.name === orderData.city);
                const newDistrict = districts.find((quan) => quan.parent_code === newCity?.code);
                return {
                    ...prevOrder,
                    id: orderData.id,
                    customerEmail: orderData.customerEmail,
                    name: orderData.name,
                    address: orderData.address,
                    phone: orderData.phone,
                    discountId: orderData.discountId,
                    shippingFee: orderData.shippingFee,
                    totalPrice: orderData.totalPrice,
                    note: orderData.note,
                    orderDate: orderData.orderDate ? orderData.orderDate.split('T')[0] : "",
                    cancelDate: orderData.cancelDate ? orderData.cancelDate.split('T')[0] : "",
                    completeDate: orderData.completeDate ? orderData.completeDate.split('T')[0] : "",
                    deliveryType: orderData.completeDate ? orderData.completeDate.split('T')[0] : "",
                    paymentType: orderData.paymentType,
                    status: orderData.status,
                    city: orderData.city,
                    district: orderData.district,
                    ward: orderData.ward,
                    cityCode: newCity?.code,
                    districtCode: newDistrict?.code,
                };
            });
        }
    }, [orderData, action]);

    useEffect(() => {
        console.log(order);
    }, [order]);

    const getLastId = async () => {
        try {
            const response = await axios.get("/Order/GetLastId");
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchShippingFee();
    }, [order.ward, order.city, order.district, order.deliveryType]);

    const fetchShippingFee = async () => {
        console.log("fetchShippingFee");
        try {
            const city = order.city;
            const district = order.district;
            const ward = order.ward;
            const type = order.deliveryType;

            const provinceId = await getProvinceID(city);
            const districtId = await getDistrictID(provinceId, district);
            const wardId = await getWardId(districtId, ward);
            const shippingFee = await calculateFee(districtId, wardId, type);

            console.log("provinceId: ", provinceId);
            console.log("districtId: ", districtId);
            console.log("wardId: ", wardId);
            console.log("shippingFee: ", shippingFee);

            setOrder((prevOrder) => ({
                ...prevOrder,
                shippingFee: shippingFee,
            }));
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const getProvinceID = async (cityName) => {
        try {
            const urlProvince = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/province';
            const response = await fetch(urlProvince, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': '0a8e7e91-8da4-11ee-a59f-a260851ba65c',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể nhận dữ liệu từ API');
            }

            const responseData = await response.json();
            const data = responseData.data;
            let provinceId = -1;

            data.forEach((dataItem) => {
                if (dataItem.NameExtension.includes(cityName)) {
                    provinceId = dataItem.ProvinceID;
                }
            });

            return provinceId;
        } catch (error) {
            console.error('Error:', error.message);
            return -1;
        }
    };

    const getDistrictID = async (provinceId, districtName) => {
        try {
            const urlDistrict = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district';
            const jsonData = JSON.stringify({province_id: provinceId});

            const response = await fetch(urlDistrict, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': '0a8e7e91-8da4-11ee-a59f-a260851ba65c',
                },
                body: jsonData,
            });

            if (!response.ok) {
                throw new Error('Không thể nhận dữ liệu từ API');
            }

            const responseData = await response.json();
            const data = responseData.data;
            let districtId = -1;

            data.forEach((dataItem) => {
                const lowercaseData = dataItem.NameExtension.map((name) => name.toLowerCase());
                const lowercaseSearchTerm = districtName.toLowerCase();

                if (lowercaseData.includes(lowercaseSearchTerm)) {
                    districtId = dataItem.DistrictID;
                }
            });

            return districtId;
        } catch (error) {
            console.error('Error:', error.message);
            return -1;
        }
    };

    const getWardId = async (districtId, wardName) => {
        try {
            const urlWard = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward';
            const jsonData = JSON.stringify({district_id: districtId});

            const response = await fetch(urlWard, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': '0a8e7e91-8da4-11ee-a59f-a260851ba65c',
                },
                body: jsonData,
            });

            if (!response.ok) {
                throw new Error('Không thể nhận dữ liệu từ API');
            }

            const responseData = await response.json();
            const data = responseData.data;

            console.log("data: ", data);

            let wardCode = -1;
            data.forEach((dataItem) => {
                const lowercaseData = dataItem.WardName.toLowerCase();
                const lowercaseSearchTerm = wardName.toLowerCase();

                if (lowercaseData.includes(lowercaseSearchTerm)) {
                    wardCode = dataItem.WardCode;
                }
            });

            return wardCode;
        } catch (error) {
            console.error('Error:', error.message);
            return -1;
        }
    };

    const calculateFee = async (toDistrictId, toWardCode, type) => {
        try {
            const fromDistrictId = 3695;
            const fromWardCode = '90737';

            let serviceId = 53320;
            if (type === "Standard") {
                serviceId = 53319;
            }

            const urlFee = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee';
            const jsonData = JSON.stringify({
                from_district_id: fromDistrictId,
                from_ward_code: fromWardCode,
                service_id: 53320,
                service_type_id: null,
                to_district_id: toDistrictId,
                to_ward_code: toWardCode,
                height: null,
                length: null,
                weight: 10000,
                width: null,
                insurance_value: 300000,
                cod_failed_amount: 20000,
                coupon: null,
            });

            const response = await fetch(urlFee, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': '0a8e7e91-8da4-11ee-a59f-a260851ba65c',
                },
                body: jsonData,
            });

            if (!response.ok) {
                throw new Error('Không thể nhận dữ liệu từ API');
            }

            const responseData = await response.json();
            const totalFee = responseData.data?.total || -1;

            return totalFee;
        } catch (error) {
            console.error('Error:', error.message);
            return -1;
        }
    };

    const handleOnChange = (e) => {
        const {id, value} = e.target;

        if (id === "city") {
            const newCity = cities.find((tinh) => tinh.name === value);
            const newDistrict = districts.find((quan) => quan.parent_code === newCity?.code);

            setOrder((prevOrder) => ({
                ...prevOrder,
                city: value,
                cityCode: newCity?.code,
                districtCode: newDistrict?.code,
            }));
        } else if (id === "district") {
            const newDistrict = districts.find((quan) => quan.name === value);

            setOrder((prevOrder) => ({
                ...prevOrder,
                district: value,
                districtCode: newDistrict?.code,
            }));
        } else {
            setOrder((prevOrder) => ({
                ...prevOrder,
                [id]: value,
            }));
        }


    }

    const handleOnSaveOrder = () => {
        if (action === "add") {
            handleAddOrder(order);
        } else {
            handleEditOrder(order);
        }
    }

    const handleSearchCustomer = async (e) => {
        try {
            const response = await axios.get(`/Customer/${order.customerEmail}`);
            const customer = response.data;
            setOrder((prevOrder) => ({
                ...prevOrder,
                name: customer.name,
                address: customer.address,
                phone: customer.phone,
                city: customer.city,
                district: customer.district,
                ward: customer.ward,
            }));
        } catch (e) {
            console.log(e);
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
                                        onBlur={(e) => handleSearchCustomer(e)}
                                        value={order.customerEmail}
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
                                        onChange={(e) => handleOnChange(e)}
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
                                        onChange={(e) => handleOnChange(e)}
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
                                        onChange={(e) => handleOnChange(e)}
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
                                        type="date"
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
                                        disabled={true}
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
                                        onChange={(e) => handleOnChange(e)}
                                        value={order.paymentType}
                                    >
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
                                        onChange={(e) => handleOnChange(e)}
                                        value={order.deliveryType}
                                    >
                                        <option value={"Standard"}>Tiêu chuẩn</option>
                                        <option value={"Express"}>Nhanh</option>
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
                                        onChange={(e) => handleOnChange(e)}
                                        value={order.status}
                                    >
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