import React, {useState, useEffect, useMemo} from "react";
import axios from "../../api/axios";
import defaultAvatar from "../../assets/images/defaultAvatar/defaultAvatar.jpeg"

const tinh_tp = require("../../Models/Address/tinh-tp.json");
const quan_huyen = require("../../Models/Address/quan-huyen.json");
const xa_phuong = require("../../Models/Address/xa-phuong.json");

export default function StaffDetail({visible, onClose, staffData, action, addStaff}) {
    const [staff, setStaff] = useState(staffData);

    const [cities, setCities] = useState();
    const [districts, setDistricts] = useState();
    const [wards, setWards] = useState();

    const cityList = Object.keys(tinh_tp).map((tinh) => { // List of provinces
        return {
            name: tinh_tp[tinh].name_with_type,
            code: tinh_tp[tinh].code
        };
    });

    const districtList = Object.keys(quan_huyen).map((quan) => {
        return {
            name: quan_huyen[quan].name_with_type,
            code: quan_huyen[quan].code,
            parent_code: quan_huyen[quan].parent_code
        };
    });

    const wardList = Object.keys(xa_phuong).map((xa) => {
            return {
                name: xa_phuong[xa].name_with_type,
                code: xa_phuong[xa].code,
                parent_code: xa_phuong[xa].parent_code
            };
        }
    );

    const [selectedAddress, setSelectedAddress] = useState({
        street: "",
        city: cityList[0].name,
        cityCode: cityList[0].code,
        district: districtList[0].name,
        districtCode: districtList[0].code,
        ward: wardList[0].name,
    });

    useEffect(() => { // Set staff data
        if (action === "add") {
            setStaff({
                email: "",
                name: "",
                password: "",
                phone: "",
                gender: "Nam",
                birthday: new Date().toISOString().split('T')[0],
                ward: "Xã Mường Pồn",
                district: "Thành phố Lào Cai",
                city: "Tỉnh Lào Cai",
                image: "",
                role: "staff",
                status: "active",
            });
            setSelectedAddress({
                ...selectedAddress,
                street: staff.address,
            });
        } else {
            setStaff(staffData);

        }
    }, [staffData]);

    useEffect(() => {
        // Kiểm tra xem cityList có phần tử nào có name giống với staff.city hay không
        const index = cityList.findIndex(city => city.name === staff.city);
        console.log(selectedAddress);

        // Nếu tìm thấy phần tử, đưa nó lên đầu danh sách
        if (index !== -1) {
            const updatedCityList = [
                cityList[index], // Phần tử tìm thấy (staff.city) lên đầu danh sách
                ...cityList.slice(0, index), // Phần tử trước index
                ...cityList.slice(index + 1) // Phần tử sau index
            ];
            setCities(updatedCityList);
        } else {
            setCities(cityList);
        }

        return () => {
            setCities([]);
        }
    }, []);

    useEffect(() => {
        setDistricts(districtList.filter((quan) => quan.parent_code === selectedAddress.cityCode));

        // Kiểm tra xem districtList có phần tử nào có name giống với staff.district hay không
        const index = districtList.findIndex(district => district.name === staff.district);

        // Nếu tìm thấy phần tử, đưa nó lên đầu danh sách
        if (index !== -1) {
            const updatedDistrictList = [
                districtList[index], // Phần tử tìm thấy (staff.district) lên đầu danh sách
                ...districtList.slice(0, index), // Phần tử trước index
                ...districtList.slice(index + 1) // Phần tử sau index
            ];
            setDistricts(updatedDistrictList);
        } else {
            setDistricts(districtList);
        }

        return () => {
            setDistricts([]);
        }
    }, [selectedAddress.cityCode]);

    useEffect(() => {
        setWards(wardList.filter((xa) => xa.parent_code === selectedAddress.districtCode));

        // Kiểm tra xem wardList có phần tử nào có name giống với staff.ward hay không
        const index = wardList.findIndex(ward => ward.name === staff.ward);

        // Nếu tìm thấy phần tử, đưa nó lên đầu danh sách
        if (index !== -1) {
            const updatedWardList = [
                wardList[index], // Phần tử tìm thấy (staff.ward) lên đầu danh sách
                ...wardList.slice(0, index), // Phần tử trước index
                ...wardList.slice(index + 1) // Phần tử sau index
            ];
            setWards(updatedWardList);
        } else {
            setWards(wardList);
        }

        return () => {
            setWards([]);
        }
    }, [selectedAddress.districtCode, selectedAddress.cityCode]);

    useEffect(() => {
        if (action === "add") {
            setSelectedAddress({
                street: "",
                city: cityList[0].name,
                cityCode: cityList[0].code,
                district: districtList[0].name,
                districtCode: districtList[0].code,
                ward: wardList[0].name,
            });
        }

        return () => {
            setSelectedAddress({});
        }
    }, [visible]);

    const handleOnChange = (e) => {
        const {id, value} = e.target;

        if (id === "city") {
            setSelectedAddress({
                    ...selectedAddress,
                    cityCode: cityList.find((tinh) => tinh.name === value).code,
                    districtCode: districtList.find((quan) => quan.parent_code === cityList.find((tinh) => tinh.name === value).code).code,
                }
            );
        } else if (id === "district") {
            setSelectedAddress({
                ...selectedAddress,
                districtCode: districtList.find((quan) => quan.name === value).code,
            });
        } else if (id === "ward" || id === "street") {
            setSelectedAddress(
                {
                    ...selectedAddress,
                    [id]: value,
                }
            );
        } else if (id === "image") {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setStaff({
                        ...staff,
                        image: reader.result,
                    });
                }
            }
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setStaff({
                ...staff,
                [id]: value,
            });
        }
    };

    const handleValidEmail = async (e) => {
        try {
            const res = await axios.get(`Staffs/Valid/email=${e.target.value}`);

            if (res.status === 409) {
                alert("Email đã tồn tại!");
            }
        } catch (e) {

        }
    }

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1 mb-5">
                    <div className="text-3xl">Thông tin nhân viên</div>
                    <button onClick={onClose}>X</button>
                </div>
                <div className="content">
                    <table className="col-span-3 form overflow-auto w-full">
                        <tbody>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="" htmlFor="id">
                                        Email(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md w-4/5 mx-2"
                                        id="email"
                                        onChange={(e) => handleOnChange(e)}
                                        onBlur={(e) => handleValidEmail(e)}
                                        value={staff.email}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="name">
                                        Tên(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="name"
                                        onChange={(e) => handleOnChange(e)}
                                        value={staff.name}
                                        required={true}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="password">
                                        Mật khẩu(*)
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="password"
                                        onChange={(e) => handleOnChange(e)}
                                        value={staff.password}
                                        required={true}
                                    />
                                </div>
                            </td>

                        </tr>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="phone">
                                        Số điện thoại(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="phone"
                                        onChange={(e) => handleOnChange(e)}
                                        value={staff.phone}
                                        required={true}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="gender">
                                        Giới tính(*)
                                    </label>
                                    <select
                                        name={"gender"}
                                        id={"gender"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        disabled={action === "detail"}
                                    >
                                        <option value={"Nam"}>Nam</option>
                                        <option value={"Nữ"}>Nữ</option>
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="birthday">
                                        Ngày sinh
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="birthday"
                                        onChange={(e) => handleOnChange(e)}
                                        value={staff.birthday}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <div className="form-group flex justify-between mb-4">
                                    <label className="" htmlFor="street">
                                        Địa chỉ(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md w-4/5 mx-2"
                                        id="street"
                                        onChange={(e) => handleOnChange(e)}
                                        value={(action === "detail") ? staff.address : selectedAddress.street}
                                        required={true}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="address">
                                        Tình trạng(*)
                                    </label>
                                    <select
                                        name={"status"}
                                        id={"status"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        value={staff.status}
                                    >
                                        <option value={"active"}>Hoạt động</option>
                                        <option value={"inactive"}>Không hoạt động</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="city">
                                        Tỉnh/Thành phố(*)
                                    </label>
                                    <select
                                        name={"city"}
                                        id={"city"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                    >
                                        {
                                            cities.map((tinh) => (
                                                <option value={tinh.name}>
                                                    {tinh.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="m" htmlFor={"district"}>
                                        Quận/Huyện(*)
                                    </label>
                                    <select
                                        name={"district"}
                                        id={"district"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                    >
                                        {
                                            districts.map((quan) => (
                                                <option key={quan.code} value={quan.name}>
                                                    {quan.name}
                                                </option>
                                            ))
                                        }
                                    </select>

                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="ward">
                                        Xã/Phường(*)
                                    </label>
                                    <select
                                        name={"ward"}
                                        id={"ward"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                    >
                                        {
                                            wards.map((xa) => (
                                                <option key={xa.code} value={xa.name}>
                                                    {xa.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="" htmlFor="image">
                                    Ảnh đại diện
                                </label>
                            </td>
                            <td>
                                <img
                                    src={
                                        action === "detail" ?
                                            staff.image ? `data:image/jpeg;base64, ${staff.image}` : defaultAvatar
                                            :
                                            staff.image ? staff.image : defaultAvatar
                                    }
                                    alt="avatar"
                                    className="w-24 h-24 rounded-full mx-auto"
                                />


                            </td>
                            <td>
                                {
                                    action === "detail" ? (
                                            <input
                                                type="file"
                                                className="form-control border border-black rounded-md mx-2"
                                                id="image"
                                                // onChange={(e) => handleOnChange(e)}
                                            />
                                        )
                                        : ("")
                                }
                            </td>
                        </tr>
                        {
                            action === "detail" ? (
                                <tr>
                                    <td>
                                        <button
                                            className="px-2 py-1 ml-2 text-white bg-blue-500 rounded-md"
                                            onClick={() => {
                                                console.log(staff)
                                            }}
                                        >
                                            Lưu
                                        </button>
                                    </td>
                                </tr>
                            ) : ("")
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}