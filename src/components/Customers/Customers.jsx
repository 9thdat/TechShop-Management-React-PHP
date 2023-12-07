import React, {useState, useEffect, useRef, useTransition} from "react";
import axios from "../../api/axios";
import CustomerDetail from "./CustomerDetail";
import CustomerStatus from "./CustomerStatus";

export default function Customers() {
    const [customers, setCustomers] = useState([]); // List of customers
    const [customer, setCustomer] = useState({}); // Data of customer
    const [visibleCustomerDetail, setVisibleCustomerDetail] = useState(false); // Visible of CustomerDetail
    const [visibleCustomerStatus, setVisibleCustomerStatus] = useState(false); // Visible of CustomerStatus
    const [action, setAction] = useState(""); // Action of CustomerDetail
    const [isPending, startTransition] = useTransition();
    const [originCustomers, setOriginCustomers] = useState([]); // List of customers before search

    const search = useRef({
        searchValue: "",
        sortValue: "name",
        statusValue: "all"
    });

    useEffect(() => {
        localStorage.setItem("menu", "customers");
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCustomers();
                setCustomers(data);
                setOriginCustomers(data);
            } catch (error) {
                console.log("Failed to fetch customer list: ", error.message);
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            // Perform any cleanup if needed
        };
    }, []);  // Empty dependency array means this effect runs once after the initial render

    const fetchCustomers = async () => {
        try {
            const response = await axios.get("/Customer");
            return response.data;
        } catch (error) {
            console.log("Failed to fetch customer list: ", error.message);
            throw error;  // Re-throw the error to be caught by the calling code
        }
    }

    const handleOpenAddCustomer = () => {
        setAction("add");
        // Sử dụng hàm callback để đảm bảo cập nhật đồng bộ
        setCustomer(() => {
            // Reset trạng thái customer thành đối tượng rỗng
            return {};
        });
        setVisibleCustomerDetail(true);
    }

    const handleAddCustomer = async (newCustomer) => {
        try {
            const res = await axios.post("/Customer", newCustomer);

            if (res.status === 201) {
                alert("Thêm khách hàng thành công!");
                handleCloseCustomerDetail("add");

                const data = await fetchCustomers();
                setCustomers(data);
            }
        } catch (error) {
            console.log("Thêm khách hàng thất bại: ", error.message);
        }
    }

    const handleDetailCustomer = (email) => {
        const customerData = customers.find((customer) => customer.email === email);
        setCustomer(customerData);
        setAction("detail");
        setVisibleCustomerDetail(true);
    }

    const handleCloseCustomerDetail = (a) => {
        setVisibleCustomerDetail(false);
        if (a === "add") {
            fetchCustomers();
        }
    }

    const handleChangeStatusCustomer = (e) => {
        const customer = customers.find((c) => c.email === e.target.value);
        setCustomer(customer);
        setVisibleCustomerStatus(true);
    }

    const handleCloseCustomerStatus = () => {
        setVisibleCustomerStatus(false);
    }

    const handleOnSearch = () => {
        const searchValue = search.current.searchValue;
        const sortValue = search.current.sortValue;
        const statusValue = search.current.statusValue;

        const searchResult = originCustomers.filter((customer) => {
                if (statusValue === "all") {
                    return customer[sortValue].toLowerCase().includes(searchValue.toLowerCase());
                } else {
                    return customer[sortValue].toLowerCase().includes(searchValue.toLowerCase()) && customer.status === statusValue;
                }
            }
        );

        setCustomers(searchResult);
    }

    const handleOnChangeSearchType = (e) => {
        const {id, value} = e.target;
        search.current = {
            ...search.current,
            [id]: value
        };
    }

    const handleOnChangeStatus = () => {
        const customerData = {
            ...customer,
            status: customer.status === "active" ? "inactive" : "active"
        };

        setCustomer(customerData);

        changeCustomerStatus();

        setVisibleCustomerStatus(false);
    }

    const changeCustomerStatus = async () => {
        try {
            const response = await axios.put(`Customer/ChangeStatus/Email=${customer.email}`);
            if (response.status === 204) {
                alert("Đổi tình trạng thành công!");
                const data = await fetchCustomers();
                setCustomers(data);
            }
            setVisibleCustomerStatus(false);
        } catch (error) {
            alert("Đổi tình trạng thất bại!");
        }
    }

    return (
        <div className="relative h-[90vh] overflow-scroll shadow-md sm:rounded-lg">
            <div className=" top-0 right-0 sticky h-[10vh] p-4 backdrop-blur-sm">
                <button
                    className="px-2 py-1 text-white bg-green-500 rounded-md"
                    onClick={handleOpenAddCustomer}>Thêm khách hàng
                </button>

                <input
                    type="text"
                    id="searchValue"
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[60%]"
                    placeholder="Tìm kiếm khách hàng"
                    value={search.searchValue}
                    onChange={(e) => handleOnChangeSearchType(e)}
                />
                <select
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[10%]"
                    id="sortValue"
                    onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="name">Tên</option>
                    <option value="email">Email</option>
                    <option value="phone">Số điện thoại</option>
                </select>
                <select
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[12%]"
                    id="statusValue"
                    onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="all">Tất cả</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                </select>

                <button className={"px-2 py-1 ml-2 text-white bg-blue-500 rounded-md"}
                        onClick={handleOnSearch}>Tìm kiếm
                </button>
            </div>
            <div className="overflow-x-scroll overflow-y-scroll h-[78vh]">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="text-center py-3">
                            Email
                        </th>
                        <th scope="col" className="text-center">
                            Tên
                        </th>
                        <th scope="col" className="text-center">
                            Số điện thoại
                        </th>
                        <th scope="col" className="text-center">
                            Giới tính
                        </th>
                        <th scope="col" className="text-center">
                            Ngày sinh
                        </th>
                        <th scope="col" className="text-center">
                            Địa chỉ
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
                                                onClick={(e) => handleDetailCustomer(customer.email)}>Chi tiết
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

            <CustomerDetail visible={visibleCustomerDetail} onClose={handleCloseCustomerDetail}
                            customerData={customer} action={action} addCustomer={handleAddCustomer}/>
            <CustomerStatus visible={visibleCustomerStatus} onClose={handleCloseCustomerStatus}
                            customerData={customer} onChangeStatus={handleOnChangeStatus}/>

        </div>
    );
}
