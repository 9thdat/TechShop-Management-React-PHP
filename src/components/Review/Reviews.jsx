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
        <div className="relative min-h-[90vh] overflow-scroll shadow-md sm:rounded-lg">
            <div className="search top-0 right-0 flex items-center justify-end sticky h-[10vh] p-4 backdrop-blur-sm">
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
                            ID Sản phẩm
                        </th>
                        <th scope="col" className="text-center">
                            Email khách hàng
                        </th>
                        <th scope="col" className="text-center">
                            Đánh giá
                        </th>
                        <th scope="col" className="text-center">
                            Trạng thái
                        </th>
                        <th scope={"col"} className="text-center">
                            Hành động
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        reviews.map((review) => (
                                <tr key={review.id}
                                    className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700">
                                    <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {review.id}
                                    </td>
                                    <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {review.productId}
                                    </td>
                                    <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {review.customerEmail}
                                    </td>
                                    <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {review.rating}
                                    </td>
                                    <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {review.adminReply ? "Đã trả lời" : "Chưa trả lời"}
                                    </td>
                                    <td scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        <button className="px-2 py-1 text-white bg-blue-500 rounded-md"
                                            // onClick={() => {
                                            //     setReview(review);
                                            //     setVisibleReviewDetail(true);
                                            // }}
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

        </div>

    );
}
