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

    const fetchCustomers = async () => {
        try {
            const response = await axios.get("/Customer");
            setCustomers(response.data);
        } catch (error) {
            console.log("Failed to fetch customer list: ", error.message);
        }
    }

    const handleAddCustomer = () => {
        setAction("add");
        // Sử dụng hàm callback để đảm bảo cập nhật đồng bộ
        setCustomer(() => {
            // Reset trạng thái customer thành đối tượng rỗng
            return {};
        });
        setVisibleCustomerDetail(true);
    }

    const handleDetailCustomer = (email) => {
        const customerData = customers.find((customer) => customer.email === email);
        setCustomer(customerData);
        setAction("detail");
        setVisibleCustomerDetail(true);
    }

    const handleCloseCustomerDetail = () => {
        setVisibleCustomerDetail(false);
    }

    const handleChangeStatusCustomer = (e) => {
        const customer = customers.find((c) => c.email === e.target.value);
        setCustomer(customer);
        setVisibleCustomerStatus(true);
    }

    const handleCloseCustomerStatus = () => {
        setVisibleCustomerStatus(false);
    }

    return (
        <div className="relative h-[90vh] overflow-scroll shadow-md sm:rounded-lg">
            <div className=" top-0 right-0 sticky h-[10vh] p-4 backdrop-blur-sm">
                <button className="px-2 py-1 text-white bg-green-500 rounded-md"
                        onClick={handleAddCustomer}>Thêm khách hàng
                </button>

                <input
                    type="text"
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[calc(100vw-32rem)]"
                    placeholder="Tìm kiếm khách hàng"
                />
                <button className="px-2 py-1 ml-2 text-white bg-blue-500 rounded-md">Tìm kiếm</button>
            </div>
            <div className="overflow-x-scroll overflow-y-scroll">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
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
                                    <td className="px-6 py-2 whitespace-nowrap">
                                        <button className="px-2 py-1 text-white bg-green-500 rounded-md"
                                                value={customer.email}
                                                onClick={(e) => handleDetailCustomer(customer.email)}>Chi tiết
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
