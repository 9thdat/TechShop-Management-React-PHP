import React, {useEffect, useState, useCallback} from "react";
import axios from "../../api/axios";
import tinh_tp from "../../Models/Address/tinh-tp.json";
import quan_huyen from "../../Models/Address/quan-huyen.json";
import xa_phuong from "../../Models/Address/xa-phuong.json";
import OrderProductDetail from "./OrderProductDetail";

export default function OrderDetails({visible, orderData, handleAddOrder, handleEditOrder, onClose, action}) {
    const [order, setOrder] = useState(() => {
        return {
            id: "",
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
            deliveryType: "Standard",
            paymentType: "Credit Card",
            status: "Processing",
            city: "Thành phố Hồ Chí Minh",
            district: "Quận 1",
            ward: "Phường Tân Định",
            cityCode: 79,
            districtCode: 760,
        }
    });
    const [visibleOrderProductDetail, setVisibleOrderProductDetail] = useState(false);
    const [orderProducts, setOrderProducts] = useState([]);
    const [orderDetail, setOrderDetail] = useState({});
    const [orderProductChanged, setOrderProductChanged] = useState(false);

    const [cities, setCities] = useState(tinh_tp);
    const [districts, setDistricts] = useState(quan_huyen);
    const [wards, setWards] = useState(xa_phuong);

    useEffect(() => {
        if (action === "add") {
            const getLastOrderId = async () => {
                await getLastId().then((res) => {
                        setOrder((prevOrder) => ({
                            ...prevOrder,
                            id: res + 1,
                        }));
                    }
                );
            }

            getLastOrderId();
        } else {
            const getDiscountCode = async () => {
                const DiscountCode = await fetchDiscountId(orderData.discountId);
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
                        discountCode: DiscountCode?.code || "",
                        discountId: orderData.discountId,
                        shippingFee: orderData.shippingFee,
                        totalPrice: orderData.totalPrice,
                        note: orderData.note,
                        orderDate: orderData.orderDate ? orderData.orderDate.split('T')[0] : "",
                        cancelDate: orderData.cancelDate ? orderData.cancelDate.split('T')[0] : "",
                        completeDate: orderData.completeDate ? orderData.completeDate.split('T')[0] : "",
                        deliveryType: orderData.deliveryType,
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

            getDiscountCode();
        }

        return () => {
            console.log("setOrder");
        }
    }, [orderData, action]);

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

        return () => {
            console.log("fetchShippingFee");
        }
    }, [order.ward, order.city, order.district, order.deliveryType]);

    const fetchShippingFee = async () => {
        try {
            const city = order.city;
            const district = order.district;
            const ward = order.ward;
            const type = order.deliveryType;

            const provinceId = await getProvinceID(city);
            const districtId = await getDistrictID(provinceId, district);
            const wardId = await getWardId(districtId, ward);
            const shippingFee = await calculateFee(districtId, wardId, type);

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
            let serviceId = 5;
            if (type === "Standard") {
                serviceId = 2;
            }

            const urlFee = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee';
            const jsonData = JSON.stringify({
                "service_type_id": serviceId,
                "from_district_id": 3695,
                "from_ward_code": "90737",
                "to_district_id": toDistrictId,
                "to_ward_code": toWardCode,
                "height": 20,
                "length": 30,
                "weight": 3000,
                "width": 40,
                "insurance_value": 0,
                "coupon": null,
                "items": [
                    {
                        "height": 20,
                        "length": 30,
                        "weight": 3000,
                        "width": 40
                    }
                ]
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

    const handleOnChange = useCallback(async (e) => {
            const {id, value} = e.target;

            if (id === "city") {
                const newCity = cities.find((tinh) => tinh.name === value);
                const newDistrict = districts.find((quan) => quan.parent_code === newCity?.code);
                const newWard = wards.find((xa) => xa.parent_code === newDistrict?.code);

                setOrder((prevOrder) => ({
                    ...prevOrder,
                    city: value,
                    cityCode: newCity?.code,
                    districtCode: newDistrict?.code,
                    district: newDistrict?.name,
                    ward: newWard?.name,
                }));
            } else if (id === "district") {
                const newDistrict = districts.find((quan) => quan.name === value);
                const newWard = wards.find((xa) => xa.parent_code === newDistrict?.code);

                setOrder((prevOrder) => ({
                    ...prevOrder,
                    district: value,
                    districtCode: newDistrict?.code,
                    ward: newWard?.name,
                }));
            } else {
                setOrder((prevOrder) => ({
                    ...prevOrder,
                    [id]: value,
                }));
            }
        }
    )

    const handleOnSaveOrder = useCallback(() => {
            if (action === "add") {
                handleAddOrder(order, orderProducts);
            } else {
                handleEditOrder(order);
            }
        }
    )

    const handleSearchCustomer = useCallback(async (e) => {
            if (order.customerEmail === "") return;
            try {
                const response = await fetchCustomerData(order.customerEmail);
                const newCity = cities.find((tinh) => tinh.name === response.city);
                const newDistrict = districts.find((quan) => quan.parent_code === newCity?.code);
                const newWard = wards.find((xa) => xa.parent_code === newDistrict?.code);
                setOrder((prevOrder) => ({
                    ...prevOrder,
                    name: response.name,
                    address: response.address,
                    phone: response.phone,
                    city: response.city,
                    district: response.district,
                    ward: response.ward,
                    cityCode: newCity?.code,
                    districtCode: newDistrict?.code,
                }));
            } catch (e) {
                console.log(e);
            }
        }
    )

    const fetchCustomerData = async (email) => {
        try {
            const response = await axios.get(`/Customer/${email}`);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    const handleOpenDetailProducts = async () => {
        if (orderProductChanged === false && action === "edit") {
            await fetchOrderDetail(orderData.id).then((res) => {
                setOrderDetail(res);
            });
        } else {
            setOrderDetail(orderProducts);
        }
        console.log(orderDetail);

        setVisibleOrderProductDetail(true);
    }

    const fetchOrderDetail = async (orderId) => {
        try {
            const response = await axios.get(`/OrderDetail/OrderId=${orderId}`);
            return response.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const handleCloseOrderProductDetail = () => {
        setVisibleOrderProductDetail(false);
        setOrderProductChanged(false);
    }

    const handleOnSaveOrderProducts = (orderProductsData) => {
        setOrderProducts(orderProductsData);
        const totalPrice = orderProductsData.reduce((total, orderProduct) => {
            return total + orderProduct.price * orderProduct.quantity;
        }, 0);
        setOrder((prevOrder) => ({
            ...prevOrder,
            totalPrice: totalPrice,
        }));
        setOrderProductChanged(true);
    }

    const handleDiscount = async (e) => {
        const discountCode = await fetchDiscountId(e.target.value);
        setOrder((prevOrder) => ({
            ...prevOrder,
            discountId: discountCode.id,
        }));
        const discountValue = discountCode.value;
        const discountType = discountCode.type;

        if (discountType === "percent") {
            const newTotalPrice = order.totalPrice * discountValue;
            setOrder((prevOrder) => ({
                ...prevOrder,
                totalPrice: newTotalPrice,
            }));
        } else if (discountType === "fixed") {
            const newTotalPrice = order.totalPrice - discountValue;
            setOrder((prevOrder) => ({
                ...prevOrder,
                totalPrice: newTotalPrice,
            }));
        }
    }

    const fetchDiscountId = async (discountCode) => {
        if (discountCode == "") return "";
        try {
            const response = await axios.get(`/Discount/Code=${discountCode}`);
            return response.data;
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
                    <button onClick={() => {
                        onClose();
                        setOrderProductChanged(false);
                    }}>X
                    </button>
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
                                        disabled={action === "edit"}
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
                                        disabled={action === "edit"}
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
                                        disabled={action === "edit"}
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
                                    disabled={action === "edit"}
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
                                    disabled={true}
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
                                        value={order.city}
                                        disabled={action === "edit"}
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
                                        value={order.district}
                                        disabled={action === "edit"}
                                    >
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
                                        value={order.ward}
                                        disabled={action === "edit"}
                                    >
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
                                        disabled={action === "edit"}
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
                                    <label className="" htmlFor="discountCode">
                                        Mã giảm giá
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="discountCode"
                                        onChange={(e) => handleOnChange(e)}
                                        onBlur={(e) => handleDiscount(e)}
                                        value={order.discountCode}
                                        disabled={action === "edit"}
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
                                        disabled={action === "edit"}
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
                                        name={"deliveryType"}
                                        id={"deliveryType"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        value={order.deliveryType}
                                        disabled={action === "edit"}
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
                                        disabled={(order.status === "Done") || (order.status === "Cancelled")}
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
                                        className="form-control border border-black rounded-md mx-2"
                                        id="note"
                                        onChange={(e) => handleOnChange(e)}
                                        value={order.note}
                                        disabled={action === "edit"}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <button
                                        className="px-2 py-1 ml-2 text-white bg-green-400 rounded-md"
                                        onClick={handleOpenDetailProducts}
                                    >
                                        Chi tiết sản phẩm
                                    </button>
                                </div>
                            </td>
                            {
                                !(orderData.status === "Done" || orderData.status === "Cancelled") &&
                                <td>
                                    <button className="px-2 py-1 ml-2 text-white bg-blue-500 rounded-md"
                                            onClick={handleOnSaveOrder}
                                    >
                                        Lưu
                                    </button>
                                </td>
                            }

                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {
                visibleOrderProductDetail &&
                <OrderProductDetail visible={visibleOrderProductDetail} onClose={handleCloseOrderProductDetail}
                                    order={order} action={action} onSave={handleOnSaveOrderProducts}
                                    orderDetail={orderDetail}/>
            }
        </div>
    );
}