import React, {useState, useEffect, useRef} from "react";
import axios from "../../api/axios";
import CustomerDetail from "../Customers/CustomerDetail";
import CustomerStatus from "../Customers/CustomerStatus";
import StaffDetail from "./StaffDetail";
import StaffPassword from "./StaffPassword";

export default function Staffs() {
    const [staffs, setStaffs] = useState([]);
    const [staff, setStaff] = useState({});

    const [action, setAction] = useState(""); // Action of CustomerDetail: add, detail
    const [visibleStaffDetail, setVisibleStaffDetail] = useState(false);

    const [originStaffs, setOriginStaffs] = useState([]); // For search
    const search = useRef({
        searchValue: "",
        sortValue: "name",
        statusValue: "all"
    });

    useEffect(() => {
        localStorage.setItem("menu", "staffs");
    }, []);

    useEffect(() => {
            fetchStaffs().then((staffs) => {
                setStaffs(staffs);
            });
        }
        , []);

    const fetchStaffs = async () => {
        try {
            const response = await axios.get("/User/Staffs");
            setOriginStaffs(response.data);
            return response.data;
        } catch (e) {
            console.log(e);
            return [];
        }
    };

    const handleOnSearch = () => {
        const searchValue = search.current.searchValue;
        const sortValue = search.current.sortValue;
        const statusValue = search.current.statusValue;

        const searchResult = originStaffs.filter((staff) => {
                if (statusValue === "all") {
                    return staff[sortValue].toLowerCase().includes(searchValue.toLowerCase());
                } else {
                    return staff[sortValue].toLowerCase().includes(searchValue.toLowerCase()) && staff.status === statusValue;
                }
            }
        );

        setStaffs(searchResult);
    }

    const handleOnChangeSearchType = (e) => {
        const {id, value} = e.target;
        search.current = {
            ...search.current,
            [id]: value
        };
    }

    const handleCloseStaffDetail = () => {
        setVisibleStaffDetail(false);
        setStaff({});
    }

    const handleOpenAddCustomer = () => {
        setAction("add");
        setVisibleStaffDetail(true);
    }

    const handleAddStaff = async (staff) => {
        try {
            const response = await axios.post("/User/Staffs", staff);
            if (response.status === 201) {
                alert("Thêm nhân viên thành công");
                setVisibleStaffDetail(false);
                setStaff({});
                fetchStaffs().then((staffs) => {
                    setStaffs(staffs);
                });
            }
        } catch (e) {
            console.log(e);
            alert("Thêm nhân viên thất bại");
        }
    }

    const handleOpenEditCustomer = (staffData) => {
        setStaff(staffData);
        setAction("detail");
        setVisibleStaffDetail(true);
    }

    const handleEditStaff = async (staff) => {
        staff.password = "password"
        try {
            const response = await axios.put("/User/Staffs/Update", staff);
            if (response.status === 204) {
                alert("Cập nhật nhân viên thành công");
                setVisibleStaffDetail(false);
                setStaff({});
                fetchStaffs().then((staffs) => {
                    setStaffs(staffs);
                });
            }
        } catch (e) {
            console.log(e);
            alert("Cập nhật nhân viên thất bại");
        }
    }


    return (
        <div className="relative h-[90vh] overflow-scroll shadow-md sm:rounded-lg">
            <div className="top-0 right-0 sticky h-[10vh] p-4 backdrop-blur-sm">
                <button
                    className="px-2 py-1 text-white bg-green-500 rounded-md"
                    onClick={handleOpenAddCustomer}
                >
                    Thêm nhân viên
                </button>

                <input
                    type="text"
                    id="searchValue"
                    className="px-2 py-1 ml-2 rounded-md border border-black w-[60%]"
                    placeholder="Tìm kiếm nhân viên"
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
                        staffs.map((staff) => (
                                <tr
                                    key={staff.email}
                                    className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700"
                                >
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {staff.email}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {staff.name}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                        {staff.phone}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {staff.gender}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {staff.birthday}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {staff.address + ", " + staff.ward + ", " + staff.district + ", " + staff.city}
                                    </td>
                                    <td
                                        scope="row"
                                        className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        {staff.status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
                                    </td>
                                    <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                                        <button
                                            className="px-2 py-1 text-white bg-green-500 rounded-md"
                                            onClick={() => handleOpenEditCustomer(staff)}
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

            <StaffDetail visible={visibleStaffDetail} onClose={handleCloseStaffDetail} staffData={staff} action={action}
                         handleAddStaff={handleAddStaff} handleEditStaff={handleEditStaff}/>
        </div>
    );

}
