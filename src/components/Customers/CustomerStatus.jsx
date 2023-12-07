import react, {useState, useEffect} from "react";
import axios from "../../api/axios";

export default function CustomerStatus({customerData, visible, onClose, onChangeStatus}) {

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Xác nhận đổi tình trạng</div>
                </div>
                <div className="content">
                    <div className="form overflow-auto">
                        <div className="form-group flex justify-between">
                                   <span>
                                        Bạn có chắc muốn đổi tình trạng của {customerData.name} thành {customerData.status === "active" ? "Ngừng hoạt động" : "Hoạt động"}?
                                   </span>
                        </div>
                        <div className="form-group flex justify-between">
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded-md"
                                onClick={onChangeStatus}
                            >
                                Đồng ý
                            </button>
                            <button className="bg-green-500 text-white px-2 py-1 rounded-md"
                                    onClick={onClose}>Hủy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}