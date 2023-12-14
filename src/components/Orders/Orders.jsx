import React, {useState, useEffect, useRef} from "react";
import axios from "../../api/axios";
import StaffDetail from "../Staffs/StaffDetail";
import OrderDetails from "./OrderDetails";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState({});

    const [action, setAction] = useState("");
    const [visibleOrderDetail, setVisibleOrderDetail] = useState(false);

    const [originalOrders, setOriginalOrders] = useState([]);

    const [search, setSearch] = useState({
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
        });
    }, []);

    useEffect(() => {
        setOriginalOrders(orders);
        console.log(orders);
    }, [orders]);


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

    const handleAddOrder = async (orderData) => {
        alert(orderData);
    }

    const handleEditOrder = async (orderData) => {
        alert(orderData);
    }

    return (
        <div className="relative h-[90vh] overflow-scroll shadow-md sm:rounded-lg">
            <div className="top-0 right-0 sticky h-[10vh] p-4 backdrop-blur-sm">
                <button
                    className="px-2 py-1 text-white bg-green-500 rounded-md"
                    // onClick={handleOpenAddCustomer}
                >
                    Thêm
                </button>

                <input
                    type="text"
                    id="searchValue"
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[60%]"
                    placeholder="Tìm kiếm đơn hàng"
                    // value={search.searchValue}
                    // onChange={(e) => handleOnChangeSearchType(e)}
                />
                <select
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[10%]"
                    id="sortValue"
                    // onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="name">Tên</option>
                    <option value="email">Email</option>
                    <option value="phone">Số điện thoại</option>
                </select>
                <select
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[12%]"
                    id="statusValue"
                    // onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="all">Tất cả</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                </select>

                <button className={"px-2 py-1 ml-2 text-white bg-blue-500 rounded-md"}
                    // onClick={handleOnSearch}
                >
                    Tìm kiếm
                </button>
            </div>
            <div className="overflow-x-scroll overflow-y-scroll h-[78vh]">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="text-center py-3">
                            ID
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
                    </thead>
                    <tbody>
                    {
                        orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700"
                                >
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {order.id}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {order.customerEmail}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {order.phone}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {order.address + ', ' + order.ward + ', ' + order.district + ', ' + order.city}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {order.totalPrice}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {order.orderDate}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {order.status === "Processing" ? "Đang xử lý" : (order.status === "Delivering" ? "Đang giao hàng" : (order.status === "Done" ? "Hoàn thành" : "Đã hủy"))}
                                    </td>
                                    <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
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

            <OrderDetails visible={visibleOrderDetail} onClose={handleCloseOrderDetail} orderData={order}
                          action={action}
                          handleAddOrder={handleAddOrder} handleEditOrder={handleEditOrder}/>
        </div>
    );
}
