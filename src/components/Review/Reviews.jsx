import React, {useEffect, useState, useRef} from "react";
import axios from "../../api/axios";
import CustomerDetail from "../Customers/CustomerDetail";
import CustomerStatus from "../Customers/CustomerStatus";

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState({});
    const [visibleReviewDetail, setVisibleReviewDetail] = useState(false);
    const [action, setAction] = useState("");
    const [originalReviews, setOriginalReviews] = useState({});

    useEffect(() => {
        localStorage.setItem("menu", "review");
    }, []);

    useEffect(() => {
        fetchReviews().then((data) => {
            setReviews(data);
            setOriginalReviews(data);
        });
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get("/Review");
            return response.data;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    return (
        <div className="relative h-[90vh] overflow-scroll shadow-md sm:rounded-lg">
            <div className=" top-0 right-0 sticky h-[10vh] p-4 backdrop-blur-sm">
                <input
                    type="text"
                    id="searchValue"
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[60%]"
                    placeholder="Tìm kiếm khách hàng"
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
                    // onClick={handleOnSearch}>Tìm kiếm
                >
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
                            ID Sản phẩm
                        </th>
                        <th scope="col" className="text-center">
                            Email khách hàng
                        </th>
                        <th scope="col" className="text-center">
                            Đánh giá
                        </th>
                        <th scope="col" className="text-center">
                            Nội dung
                        </th>
                        <th scope="col" className="text-center">
                            Admin trả lời
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        customers.map((customer) => (
                                <tr key={customer.email}
                                    className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700">
                                    <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.email}
                                    </td>
                                    <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.name}
                                    </td>
                                    <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.phone}
                                    </td>
                                    <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.gender}
                                    </td>
                                    <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.birthday}
                                    </td>
                                    <td scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.address + ', ' + customer.ward + ', ' + customer.district + ', ' + customer.city}
                                    </td>
                                    <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
                                    </td>
                                    <td className="px-6 py-2 whitespace-nowrap">
                                        <button className="px-2 py-1 text-white bg-green-500 rounded-md"
                                                value={customer.email}
                                                onClick={(e) => handleDetailCustomer(customer)}>Chi tiết
                                        </button>
                                        <button className="px-2 py-1 ml-2 text-white bg-red-400 rounded-md"
                                                value={customer.email}
                                                onClick={(e) => handleChangeStatusCustomer(e)}>Đổi tình trạng
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
                visibleCustomerDetail &&
                <CustomerDetail visible={visibleCustomerDetail} onClose={handleCloseCustomerDetail}
                                customerData={customer} action={action} addCustomer={handleAddCustomer}/>
            }

            {
                visibleCustomerStatus &&
                <CustomerStatus visible={visibleCustomerStatus} onClose={handleCloseCustomerStatus}
                                customerData={customer} onChangeStatus={handleOnChangeStatus}/>
            }

        </div>

    );
}
