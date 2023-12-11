import React, {useState, useEffect, useRef} from "react";
import axios from "../../api/axios";
import DiscountDetail from "./DiscountDetail";

export default function Discounts() {
    const [discounts, setDiscounts] = useState([]);
    const [discount, setDiscount] = useState({});

    const [action, setAction] = useState("");
    const [visibleDiscountDetail, setVisibleDiscountDetail] = useState(false);

    const [originalDiscounts, setOriginalDiscounts] = useState([]);

    const search = useRef({
        searchValue: "",
        sortValue: "code",
        statusValue: "all"
    });

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

    const handleOnSearch = () => {
        const searchValue = search.current.searchValue;
        const sortValue = search.current.sortValue;
        const statusValue = search.current.statusValue;

        const searchResult = originalDiscounts.filter((discount) => {
            const discountValue = discount[sortValue];

            if (statusValue === "all") {
                return discountValue.toString().toLowerCase().includes(searchValue.toLowerCase());
            } else {
                return discountValue.toString().toLowerCase().includes(searchValue.toLowerCase()) && discount.status === statusValue;
            }
        });

        setDiscounts(searchResult);
    }

    const handleOnChangeSearchType = (e) => {
        const {id, value} = e.target;
        search.current = {
            ...search.current,
            [id]: value
        };
    }

    const handleOpenEditDiscount = (discount) => {
        setDiscount(discount);
        setAction("edit");
        setVisibleDiscountDetail(true);
    }

    const handleOpenAddDiscount = async () => {
        setAction("add");
        const lastId = await fetchLastDiscountId();
        setDiscount({
            ...discount,
            id: lastId + 1,
            startDate: new Date().toISOString().split('T')[0],
            status: "active",
            type: "percent",
            minApply: 0,
            maxSpeed: -1,
        })
        setVisibleDiscountDetail(true);
    }

    const handleCloseDiscountDetail = () => {
        setVisibleDiscountDetail(false);
        setDiscount({});
    }

    const handleAddDiscount = async (discount) => {
        try {
            const response = await axios.post("/Discount", discount);
            if (response.status === 201) {
                alert("Thêm mã giảm giá thành công");
                setDiscounts([...discounts, discount]);
                setOriginalDiscounts([...originalDiscounts, discount]);
                setVisibleDiscountDetail(false);
                setDiscount({});
            }
        } catch (e) {
            console.error(e.message);
            alert("Thêm mã giảm giá thất bại");
        }
    }

    const handleEditDiscount = async (discount) => {
        try {
            const response = await axios.put("Discount", discount);
            if (response.status === 204) {
                alert("Sửa mã giảm giá thành công");
                const newDiscounts = discounts.map((item) => {
                    if (item.id === discount.id) {
                        return discount;
                    }
                    return item;
                });
                setDiscounts(newDiscounts);
                const newOriginalDiscounts = originalDiscounts.map((item) => {
                    if (item.id === discount.id) {
                        return discount;
                    }
                    return item;
                });
                setOriginalDiscounts(newOriginalDiscounts);
                setVisibleDiscountDetail(false);
                setDiscount({});
            }
        } catch (e) {
            console.error(e.message);
            alert("Sửa mã giảm giá thất bại");
        }
    }

    const fetchLastDiscountId = async () => {
        try {
            const response = await axios.get("/Discount/GetLastId");
            return response.data;
        } catch (e) {
            console.error(e.message);
            return 0;
        }
    }

    return (
        <div className="relative h-[90vh] overflow-scroll shadow-md sm:rounded-lg">
            <div className="top-0 right-0 sticky h-[10vh] p-4 backdrop-blur-sm">
                <button
                    className="px-2 py-1 text-white bg-green-500 rounded-md"
                    onClick={handleOpenAddDiscount}
                >
                    Thêm
                </button>

                <input
                    type="text"
                    id="searchValue"
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[60%]"
                    placeholder="Tìm kiếm mã giảm giá"
                    value={search.searchValue}
                    onChange={(e) => handleOnChangeSearchType(e)}
                />
                <select
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[10%]"
                    id="sortValue"
                    onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="code">Mã</option>
                    <option value="value">Trị giá</option>
                </select>
                <select
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[12%]"
                    id="statusValue"
                    onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="all">Tất cả</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                    <option value="expired">Đã hết hạn</option>
                </select>

                <button className={"px-2 py-1 ml-2 text-white bg-blue-500 rounded-md"}
                        onClick={handleOnSearch}
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
                            Trị giá
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
                                        {discount.status === "active" ? "Đang hoạt động" : (discount.status === "inactive" ? "Ngừng hoạt động" : "Đã hết hạn")}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        <button
                                            className="px-2 py-1 text-white bg-blue-500 rounded-md"
                                            onClick={() => handleOpenEditDiscount(discount)}
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

            <DiscountDetail visible={visibleDiscountDetail} onClose={handleCloseDiscountDetail} discountData={discount}
                            action={action} handleAddDiscount={handleAddDiscount}
                            handleEditDiscount={handleEditDiscount}/>
        </div>
    );
}
