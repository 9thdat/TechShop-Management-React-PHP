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
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm"
        >
            <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                    <div className="text-2xl">Thông tin mã giảm giá</div>
                    <button onClick={onClose}>X</button>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div className="">
                        <label className="" htmlFor="id">
                            ID(*)
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="id"
                            value={discount.id}
                            disabled={true}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor="name">
                            Mã(*)
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="code"
                            onChange={(e) => handleOnChange(e)}
                            value={discount.code}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor="type">
                            Loại(*)
                        </label>
                        <select
                            name={"type"}
                            id={"type"}
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            onChange={(e) => handleOnChange(e)}
                            value={discount.type}
                        >
                            <option value={"percent"}>Phần trăm</option>
                            <option value={"fixed"}>Tiền mặt</option>
                        </select>
                    </div>
                    <div className="">
                        <label className="" htmlFor="value">
                            Trị giá(*)
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="value"
                            onChange={(e) => handleOnChange(e)}
                            value={discount.value}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor="startDate">
                            Ngày bắt đầu(*)
                        </label>
                        <input
                            type="date"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="startDate"
                            onChange={(e) => handleOnChange(e)}
                            value={discount.startDate}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor="endDate">
                            Ngày kết thúc(*)
                        </label>
                        <input
                            type="date"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="endDate"
                            onChange={(e) => handleOnChange(e)}
                            value={discount.endDate}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor="status">
                            Tình trạng(*)
                        </label>
                        <select
                            name={"status"}
                            id={"status"}
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            onChange={(e) => handleOnChange(e)}
                            value={discount.status}
                        >
                            <option value={"active"}>Hoạt động</option>
                            <option value={"disable"}>Không hoạt động</option>
                            <option value={"expired"}>Hết hạn</option>
                        </select>
                    </div>
                    <div className="">
                        <label className="" htmlFor="minApply">
                            Giá trị tối thiểu áp dụng
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="minApply"
                            value={discount.minApply}
                            onChange={(e) => handleOnChange(e)}
                        />
                    </div>
                    <div className="">
                        <label className="m" htmlFor={"maxSpeed"}>
                            Giá trị tối đa được giảm
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="maxSpeed"
                            value={discount.maxSpeed}
                            onChange={(e) => handleOnChange(e)}
                        />

                    </div>
                    <div className="">
                        <label className="" htmlFor="quantity">
                            Số lượng(*)
                        </label>
                        <input
                            type="text"
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="quantity"
                            onChange={(e) => handleOnChange(e)}
                            value={discount.quantity}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="" htmlFor="description">
                            Mô tả
                        </label>
                        <textarea
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            id="description"
                            onChange={(e) => handleOnChange(e)}
                            value={discount.description}
                        />
                    </div>
                    <div className={"flex justify-end"}>
                        <button
                            className="px-2 py-1 text-white bg-blue-500 rounded-md"
                            onClick={(e) => handleOnSave(e)}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}