import React, {useState, useEffect, useRef} from "react";
import axios from "../../api/axios";
import StaffDetail from "../Staffs/StaffDetail";
import OrderDetails from "./OrderDetails";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState({});

    const [action, setAction] = useState(""); // add or edit
    const [visibleOrderDetail, setVisibleOrderDetail] = useState(false);

    const [originalOrders, setOriginalOrders] = useState([]);

    const search = useRef({
        searchValue: "",
        sortValue: "name",
        statusValue: "all",
    });

    useEffect(() => {
        localStorage.setItem("menu", "orders");
    }, []);

    useEffect(() => {
        fetchOrders().then((res) => {
            setOrders(res);
            setOriginalOrders(res);
        });
    }, []);


    const fetchOrders = async () => {
        try {
            const res = await axios.get("/Order");
            return res.data;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    const handleOnSearch = () => {
        const searchValue = search.current.searchValue;
        const sortValue = search.current.sortValue;
        const statusValue = search.current.statusValue;

        const searchResult = originalOrders.filter((order) => {
                if (statusValue === "all") {
                    return order[sortValue].toLowerCase().includes(searchValue.toLowerCase());
                } else {
                    return order[sortValue].toLowerCase().includes(searchValue.toLowerCase()) && order.status === statusValue;
                }
            }
        );

        setOrders(searchResult);
    }

    const handleOnChangeSearchType = (e) => {
        const {id, value} = e.target;
        search.current = {
            ...search.current,
            [id]: value
        };
    }

    const handleCloseOrderDetail = () => {
        setVisibleOrderDetail(false);
        setOrder({});
    }

    const handleOpenOrderDetail = (orderData) => {
        setOrder(orderData);
        setAction("edit");
        setVisibleOrderDetail(true);
    }

    const handleOpenAddOrder = () => {
        setAction("add");
        setVisibleOrderDetail(true);
    }

    const handleOpenEditOrder = () => {
        setAction("edit");
        setVisibleOrderDetail(true);
    }

    const handleAddOrder = async (orderData, orderProducts) => {
        let failedOrderDetail = [];
        console.log("orderData", orderData);
        if (orderData.discountId === "") {
            orderData = {
                ...orderData,
                discountId: null,
            }
        }

        try {
            const orderResponse = await axios.post("/Order", orderData);

            if (orderResponse.status >= 200 && orderResponse.status < 300) {
                const orderId = orderResponse.data;
                const orderDetailsPromises = orderProducts.map(async (order) => {
                    order = {
                        ...order,
                        orderId: orderData.id,
                    }
                    try {
                        const response = await axios.post("/OrderDetail", order);

                        if (response.status >= 200 && response.status < 300) {
                            return null; // Success
                        } else {
                            failedOrderDetail.push(order.productId);
                        }
                    } catch (error) {
                        failedOrderDetail.push(order.productId);
                    }
                });

                const orderDetailsResults = await Promise.all(orderDetailsPromises);
            } else {
                alert("Thêm đơn hàng thất bại");
            }

            if (failedOrderDetail.length === 0) {
                alert("Thêm đơn hàng thành công");
                setVisibleOrderDetail(false);
                await fetchOrders().then((res) => {
                        setOrders(res);
                        setOriginalOrders(res);
                    }
                );
            } else {
                alert("Các sản phẩm sau không được thêm vào đơn hàng: " + failedOrderDetail.join(", "));
            }
        } catch (error) {
            alert("Thêm đơn hàng thất bại");
        }
    };

    const handleEditOrder = async (orderData) => {
        try {
            const orderResponse = await axios.put(`/Order/${orderData.id}`, orderData);

            if (orderResponse.status >= 200 && orderResponse.status < 300) {
                setVisibleOrderDetail(false);
                setOrder({});
                const newOrders = orders.map((order) => (order.id === orderData.id ? orderData : order));
                setOrders(newOrders);
            } else {
                alert("Cập nhật đơn hàng thất bại");
                return;
            }

            alert("Cập nhật hàng thành công");
            setVisibleOrderDetail(false);
        } catch (error) {
            alert("Cập nhật đơn hàng thất bại");
        }
    };


    return (
        <div className="relative min-h-[90vh] overflow-scroll shadow-md sm:rounded-lg">
            <div className="search top-0 right-0 flex items-center justify-end sticky h-[10vh] p-4 backdrop-blur-sm">
                <button
                    className="px-2 py-1 text-white bg-green-500 rounded-md"
                    onClick={handleOpenAddOrder}
                >
                    Thêm
                </button>
                <input
                    type="text"
                    id="searchValue"
                    className="px-2 py-1 ml-2 rounded-md border border-black w-20 sm:w-60 md:w-80 lg:w-[66%]"
                    placeholder="Tìm kiếm đơn hàng"
                    value={search.searchValue}
                    onChange={(e) => handleOnChangeSearchType(e)}
                />
                <select
                    className="px-2 py-1 ml-2 rounded-md border border-black w-20 sm:w-24 md:w-28 lg:w-32"
                    id="sortValue"
                    onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="name">Tên</option>
                    <option value="email">Email</option>
                    <option value="phone">Số điện thoại</option>
                </select>
                <select
                    className="px-2 py-1 ml-2 rounded-md border border-black w-24 sm:w-32 md:w-40 lg:w-48"
                    id="statusValue"
                    onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="all">Tất cả</option>
                    <option value="Processing">Đang xử lý</option>
                    <option value="Delivering">Đang giao hàng</option>
                    <option value="Done">Hoàn thành</option>
                    <option value="Cancelled">Đã hủy</option>
                </select>

                <button className={"px-2 py-1 ml-2 text-white bg-blue-500 rounded-md"}
                        onClick={handleOnSearch}
                >
                    Tìm kiếm
                </button>
            </div>
            <div className="overflow-x-auto overflow-y-auto h-[78vh]">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <tbody className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="text-center py-3">
                            ID
                        </th>
                        <th scope="col" className="text-center">
                            Tên khách hàng
                        </th>
                        <th scope="col" className="text-center">
                            Email khách hàng
                        </th>
                        <th scope="col" className="text-center">
                            Số điện thoại
                        </th>
                        <th scope="col" className="text-center">
                            Địa chỉ
                        </th>
                        <th scope="col" className="text-center">
                            Trị giá
                        </th>
                        <th scope="col" className="text-center">
                            Ngày đặt hàng
                        </th>
                        <th scope="col" className="text-center">
                            Tình trạng
                        </th>
                        <th scope="col" className="text-center">
                            Hành động
                        </th>
                    </tr>
                    </tbody>
                    <tbody className={"text-xs"}>
                    {
                        orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700"
                                >
                                    <td
                                        scope="row"
                                        className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {order.id}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {order.name}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {order.customerEmail}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {order.phone}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {order.address + ', ' + order.ward + ', ' + order.district + ', ' + order.city}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {order.totalPrice}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {order.orderDate}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {order.status === "Processing" ? "Đang xử lý" : (order.status === "Delivering" ? "Đang giao hàng" : (order.status === "Done" ? "Hoàn thành" : "Đã hủy"))}
                                    </td>
                                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        <button
                                            className="px-2 py-1 text-white bg-green-500 rounded-md"
                                            onClick={() => handleOpenOrderDetail(order)}
                                        >
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            )
                        )
                    }
                    </tbody>
                </table>
            </div>

            {
                visibleOrderDetail &&
                <OrderDetails visible={visibleOrderDetail} onClose={handleCloseOrderDetail} orderData={order}
                              action={action}
                              handleAddOrder={handleAddOrder} handleEditOrder={handleEditOrder}/>
            }
        </div>
    );
}
