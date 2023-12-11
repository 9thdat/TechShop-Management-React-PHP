import React, {useEffect, useState} from "react";
import axios from "../../api/axios";

export default function DiscountDetail({
                                           visible,
                                           onClose,
                                           discountData,
                                           handleAddDiscount,
                                           handleEditDiscount,
                                           action
                                       }) {
    const [discount, setDiscount] = useState(discountData);

    useEffect(() => {
        setDiscount(discountData);
    }, [discountData]);

    const handleOnChange = (e) => {
        const {id, value} = e.target;
        setDiscount({
            ...discount,
            [id]: value,
        });
    };

    const handleOnSave = (e) => {
        e.preventDefault();
        if (action === "add") {
            handleAddDiscount(discount);
        } else if (action === "edit") {
            handleEditDiscount(discount);
        }
    };

    if (!visible) return null;
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1 mb-5">
                    <div className="text-3xl">Thông tin mã giảm giá</div>
                    <button onClick={onClose}>X</button>
                </div>
                <div className="content">
                    <table className="col-span-3 form overflow-auto w-full">
                        <tbody>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="" htmlFor="id">
                                        ID(*)
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control border border-black rounded-md w-4/5 mx-2`}
                                        id="id"
                                        value={discount.id}
                                        disabled={true}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="name">
                                        Mã(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="code"
                                        onChange={(e) => handleOnChange(e)}
                                        value={discount.code}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="type">
                                        Loại(*)
                                    </label>
                                    <select
                                        name={"type"}
                                        id={"type"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        value={discount.type}
                                    >
                                        <option value={"percent"}>Phần trăm</option>
                                        <option value={"fixed"}>Tiền mặt</option>
                                    </select>
                                </div>
                            </td>

                        </tr>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="value">
                                        Trị giá(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="value"
                                        onChange={(e) => handleOnChange(e)}
                                        value={discount.value}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="startDate">
                                        Ngày bắt đầu(*)
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="startDate"
                                        onChange={(e) => handleOnChange(e)}
                                        value={discount.startDate}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="endDate">
                                        Ngày kết thúc(*)
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="endDate"
                                        onChange={(e) => handleOnChange(e)}
                                        value={discount.endDate}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <div className="form-group flex justify-between mb-4">
                                    <label className="" htmlFor="description">
                                        Mô tả
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md w-4/5 mx-2"
                                        id="description"
                                        onChange={(e) => handleOnChange(e)}
                                        value={discount.description}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="status">
                                        Tình trạng(*)
                                    </label>
                                    <select
                                        name={"status"}
                                        id={"status"}
                                        className="form-control border border-black rounded-md mx-2"
                                        onChange={(e) => handleOnChange(e)}
                                        value={discount.status}
                                    >
                                        <option value={"active"}>Hoạt động</option>
                                        <option value={"disable"}>Không hoạt động</option>
                                        <option value={"expired"}>Hết hạn</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="minApply">
                                        Giá trị tối thiểu áp dụng
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="minApply"
                                        value={discount.minApply}
                                        onChange={(e) => handleOnChange(e)}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="m" htmlFor={"maxSpeed"}>
                                        Giá trị tối đa được giảm
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="maxSpeed"
                                        value={discount.maxSpeed}
                                        onChange={(e) => handleOnChange(e)}
                                    />

                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="" htmlFor="quantity">
                                        Số lượng(*)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md mx-2"
                                        id="quantity"
                                        onChange={(e) => handleOnChange(e)}
                                        value={discount.quantity}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr className={""}>
                            <td className={""}>
                                <button
                                    className="px-2 py-1 ml-2 text-white bg-blue-500 rounded-md"
                                    onClick={(e) => handleOnSave(e)}
                                >
                                    Lưu
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}