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
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-3xl"
        >
            <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                    <div className="text-3xl">Đổi mật khẩu</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                        <label className="text-xl">Mật khẩu mới</label>
                        <input
                            className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="">
                        <button
                            className="bg-red-500 text-white px-2 py-1 rounded-md"
                            onClick={(e) => ChangePassword(e)}
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
    )
}