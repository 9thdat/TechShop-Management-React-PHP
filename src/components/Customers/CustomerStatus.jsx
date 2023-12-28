import react, {useState, useEffect} from "react";

export default function CustomerStatus({customerData, visible, onClose, onChangeStatus}) {

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                    <div className="text-3xl">Xác nhận đổi tình trạng</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2 text-xl text-center">
                                   <span>
                                        Bạn có chắc muốn đổi tình trạng của {customerData.name} thành {customerData.status === "active" ? "Ngừng hoạt động" : "Hoạt động"}?
                                   </span>
                    </div>
                    <div className="">
                        <button
                            className="bg-red-500 text-white px-2 py-1 rounded-md"
                            onClick={onChangeStatus}
                        >
                            Đồng ý
                        </button>
                    </div>
                    <div className="flex justify-end">
                        <button className="bg-green-500 text-white px-2 py-1 rounded-md"
                                onClick={onClose}>Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}