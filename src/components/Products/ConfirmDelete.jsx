import React, {useState, useEffect} from "react";

export default function ConfirmDelete({visible, onDelete, onAbortDelete}) {
    if (!visible) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm"
        >
            <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                    <div className="text-3xl">Xác nhận xóa</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2 text-xl">
                                   <span>
                                        Bạn có chắc chắn muốn xóa sản phẩm này?
                                        <br/>Thao tác này sẽ làm số lượng sản phẩm về 0!
                                   </span>
                    </div>
                    <div className="">
                        <button className="bg-red-500 text-white px-2 py-1 rounded-md" onClick={onDelete}>Xóa
                        </button>
                    </div>
                    <div className="flex justify-end">
                        <button className="bg-green-500 text-white px-2 py-1 rounded-md"
                                onClick={onAbortDelete}>Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}