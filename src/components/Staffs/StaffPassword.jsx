import React, {useState} from "react";

export default function StaffPassword({visible, onClose, staffEmail, handleChangePassword}) {
    const [password, setPassword] = useState("");

    const ChangePassword = (e) => {
        e.preventDefault();
        handleChangePassword(password);
        onClose();
    }
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Đổi mật khẩu</div>
                </div>
                <div className="content">
                    <div className="form overflow-auto">
                        <div className="form-group flex justify-between">
                            <label className="font-semibold">Mật khẩu mới</label>
                            <input
                                className="border border-gray-400 rounded-md px-2 py-1"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group flex justify-between">
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded-md"
                                onClick={(e) => ChangePassword(e)}
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
    )
}