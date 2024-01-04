import React, {useState, useEffect, useRef} from "react";
import CustomerDetail from "../Customers/CustomerDetail";
import CustomerStatus from "../Customers/CustomerStatus";
import StaffDetail from "./StaffDetail";
import StaffPassword from "./StaffPassword";
import {AddStaff, fetchStaffs, UpdateStaff} from "../../services/User/User";

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
        sessionStorage.setItem("menu", "staffs");
    }, []);

    useEffect(() => {
            fetchStaffs().then((staffs) => {
                setStaffs(staffs);
                setOriginStaffs(staffs);
            });
        }
        , []);


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
            const response = await AddStaff(staff);
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
            const response = await UpdateStaff(staff);
            if (response.status === 200) {
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
        <div className="">
            <div className="top-0 right-0 backdrop-blur-sm grid grid-cols-6 grid-rows-2 lg:grid-rows-1 lg:text-xl">
                <button
                    className="col-start-1 col-end-3 lg:col-end-2 row-start-1 row-end-2 border border-green-500 rounded-md bg-green-500 text-white"
                    onClick={handleOpenAddCustomer}
                >
                    Thêm mới
                </button>

                <input
                    type="text"
                    id="searchValue"
                    className="col-start-3 lg:col-start-2 col-end-7 lg:col-end-4 row-start-1 row-end-2 border border-blue-300 rounded-md"
                    placeholder="Tìm kiếm nhân viên"
                    value={search.searchValue}
                    onChange={(e) => handleOnChangeSearchType(e)}
                />
                <select
                    className="col-start-1 col-end-3 lg:col-start-4 lg:col-end-5 row-start-2 lg:row-start-1 row-end-3 lg:row-end-2 border border-blue-300 rounded-md"
                    id="sortValue"
                    onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="name">Tên</option>
                    <option value="email">Email</option>
                    <option value="phone">Số điện thoại</option>
                </select>
                <select
                    className="col-start-3 col-end-5 lg:col-start-5 lg:col-end-6 row-start-2 row-end-3 lg:row-start-1 lg:row-end-2 border border-blue-300 rounded-md"
                    id="statusValue"
                    onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="all">Tất cả</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                </select>

                <button
                    className="col-start-5 col-end-7 lg:col-start-6 lg:col-end-7 row-start-2 row-end-3 lg:row-start-1 lg:row-end-2 border border-blue-300 rounded-md bg-blue-400 text-white"
                    onClick={handleOnSearch}
                >
                    Tìm kiếm
                </button>
            </div>
            <div className="overflow-x-auto overflow-y-auto h-[85vh] lg:h-[87vh]">
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
                    <tbody className={"text-xs md:text-base text-center"}>
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
