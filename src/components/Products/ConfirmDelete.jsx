import React, {useState, useEffect} from "react";

export default function ConfirmDelete({visible, onDelete, onAbortDelete}) {
    if (!visible) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Xác nhận xóa</div>
                </div>
                <div className="content">
                    <div className="form overflow-auto">
                        <div className="form-group flex justify-between">
                                   <span>
                                        Bạn có chắc chắn muốn xóa sản phẩm này?
                                        <br/>Thao tác này sẽ làm số lượng sản phẩm về 0!
                                   </span>
                        </div>
                        <div className="form-group flex justify-between">
                            <button className="bg-red-500 text-white px-2 py-1 rounded-md" onClick={onDelete}>Xóa
                            </button>
                            <button className="bg-green-500 text-white px-2 py-1 rounded-md"
                                    onClick={onAbortDelete}>Hủy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}