import React, {useState, useEffect} from "react";
import axios from "../../api/axios";

export default function Discounts() {
    const [discounts, setDiscounts] = useState([]);
    const [discount, setDiscount] = useState({});

    const [originalDiscounts, setOriginalDiscounts] = useState([]);

    useEffect(() => {
        localStorage.setItem("menu", "discounts");
    }, []);

    useEffect(() => {
        fetchDiscounts().then((data) => {
            setDiscounts(data);
        });
    }, []);

    const fetchDiscounts = async () => {
        try {
            const response = await axios.get("/Discount");
            setOriginalDiscounts(response.data);
            return response.data;
        } catch (e) {
            console.error(e.message);
            return [];
        }
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
                    placeholder="Tìm kiếm mã giảm giá"
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
                        <th scope="col" className="text-center ">
                            Mã
                        </th>
                        <th scope="col" className="text-center ">
                            Loại giảm giá
                        </th>
                        <th scope="col" className="text-center ">
                            Giá trị
                        </th>
                        <th scope="col" className="text-center ">
                            Số lượng
                        </th>
                        <th scope="col" className="text-center ">
                            Ngày bắt đầu
                        </th>
                        <th scope="col" className="text-center ">
                            Ngày kết thúc
                        </th>
                        <th scope="col" className="text-center ">
                            Trạng thái
                        </th>
                        <th scope="col" className="text-center ">
                            Hành động
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        discounts.map(discount => (
                                <tr
                                    key={discount.id}
                                    className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700"
                                >
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {discount.id}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {discount.code}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {discount.type}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {discount.value}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {discount.quantity}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {discount.startDate}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {discount.endDate}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {discount.status}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        <button
                                            className="px-2 py-1 text-white bg-blue-500 rounded-md"
                                            // onClick={() => handleOpenEditCustomer(customer)}
                                        >
                                            Sửa
                                        </button>
                                    </td>
                                </tr>
                            )
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
