import React, {useState, useEffect} from "react";
import axios from "../../api/axios";
import CustomerDetail from "./CustomerDetail";
import CustomerStatus from "./CustomerStatus";

export default function Customers() {
    const [customers, setCustomers] = useState([]); // List of customers
    const [customer, setCustomer] = useState({}); // Data of customer
    const [visibleCustomerDetail, setVisibleCustomerDetail] = useState(false); // Visible of CustomerDetail
    const [visibleCustomerStatus, setVisibleCustomerStatus] = useState(false); // Visible of CustomerStatus
    const [action, setAction] = useState(""); // Action of CustomerDetail

    useEffect(() => {
        localStorage.setItem("menu", "customers");
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        // Reset customer state when the component mounts or when it updates
        setCustomer({});
    }, [visibleCustomerDetail, visibleCustomerStatus]);


    const fetchCustomers = async () => {
        try {
            const response = await axios.get("/Customer");
            setCustomers(response.data);
        } catch (error) {
            console.log("Failed to fetch customer list: ", error.message);
        }
    }

    const handleAddCustomer = (e) => {
        setAction("add");
        setVisibleCustomerDetail(true);
    }

    const handleDetailCustomer = (e) => {
        const customer = customers.find((customer) => customer.email === e.target.value);
        setCustomer(customer);
        setAction("detail");
        setVisibleCustomerDetail(true);
    }

    const handleCloseCustomerDetail = () => {
        setVisibleCustomerDetail(false);
    }

    const handleChangeStatusCustomer = (e) => {
        const customer = customers.find((customer) => customer.email === e.target.value);
        setCustomer(customer);
        setVisibleCustomerStatus(true);
    }

    const handleCloseCustomerStatus = () => {
        setVisibleCustomerStatus(false);
    }

    return (
        <div className="relative h-[90vh] overflow-x-scroll overflow-y-scroll shadow-md sm:rounded-lg">
            <div className="h-[10vh] top-0 right-0 p-4 sticky backdrop-blur-sm">
                <button className="px-2 py-1 text-white bg-green-500 rounded-md"
                        onClick={(e) => handleAddCustomer(e)}>Thêm khách hàng
                </button>

                <input type="text" className="px-2 py-1 ml-2 rounded-md border border-black w-4/5"
                       placeholder="Tìm kiếm khách hàng"/>
                <button className="px-2 py-1 ml-2 text-white bg-blue-500 rounded-md">Tìm kiếm</button>
            </div>
            <div className="overflow-scroll">
                <table className="w-full overflow-scroll text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tên
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Số điện thoại
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Giới tính
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Ngày sinh
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Địa chỉ
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tình trạng
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Hành động
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        customers.map((customer) => (
                                <tr key={customer.email}
                                    className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.email}
                                    </th>
                                    <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.name}
                                    </th>
                                    <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.phone}
                                    </th>
                                    <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.gender}
                                    </th>
                                    <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.birthday}
                                    </th>
                                    <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.address + ', ' + customer.ward + ', ' + customer.district + ', ' + customer.city}
                                    </th>
                                    <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {customer.status}
                                    </th>
                                    <td className="px-6 py-2">
                                        <button className="px-2 py-1 text-white bg-green-500 rounded-md"
                                                value={customer.email}
                                                onClick={(e) => handleDetailCustomer(e)}>Chi tiết
                                        </button>
                                        <button className="px-2 py-1 ml-2 text-white bg-blue-500 rounded-md"
                                                value={customer.email}
                                                onClick={(e) => handleChangeStatusCustomer(e)}>Sửa trạng thái
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
                            customerData={customer} action={action}/>
            <CustomerStatus visible={visibleCustomerStatus} onClose={handleCloseCustomerStatus}
                            customerData={customer}/>
        </div>
    );
}
