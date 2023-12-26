import React, {useState, useEffect} from "react";
import axios from "../../api/axios";
import ConfirmDeleteProductParameter from "./ConfirmDeleteProductParameter";

export default function ProductPhone({visible, onClose, data, action, onSave, onReload}) {
    const [productPhoneData, setProductPhoneData] = useState({});
    const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);

    useEffect(() => {
        setProductPhoneData(data);
    }, [data]);

    const handleOnChange = (e, index) => {
        const {id, value} = e.target;
        setProductPhoneData(
            {
                ...productPhoneData,
                [id]: value
            }
        );
    };

    const handleOnSave = () => {
        onSave(productPhoneData);
        onClose();
    };

    if (!visible) {
        return null;
    }

    const handleOpenDelete = () => {
        setVisibleConfirmDelete(true);
    }

    const handleOnDelete = async () => {
        try {
            const res = await axios.delete(`/ParameterPhone/${productPhoneData.id}`);
            if (res.status === 204) {
                alert("Xóa thông số điện thoại thành công!");
                onReload();
                setVisibleConfirmDelete(false);
                onClose();
            } else {
                alert("Xóa thông số điện thoại thất bại!");
                setVisibleConfirmDelete(false);
            }
        } catch (e) {
            alert("Xóa thông số điện thoại thất bại!");
            console.log(e);
            setVisibleConfirmDelete(false);
        }
    }

    const handleOnAbortDelete = () => {
        setVisibleConfirmDelete(false);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                    <div className="">Thông số điện thoại</div>
                    <button onClick={() => {
                        onClose();
                    }}>X
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <div className="">
                        <label className="" htmlFor="screen">Màn hình</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                               id="screen"
                               onChange={(e) => handleOnChange(e)}
                               value={productPhoneData.screen}/>
                    </div>
                    <div className="">
                        <label className="" htmlFor="operatingSystem">Hệ điều hành</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                               id="operatingSystem"
                               onChange={(e) => handleOnChange(e)}
                               value={productPhoneData.operatingSystem}/>
                    </div>
                    <div className="">
                        <label className="" htmlFor="backCamera">Camera sau</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                               id="backCamera"
                               onChange={(e) => handleOnChange(e)}
                               value={productPhoneData.backCamera}/>
                    </div>
                    <div className="">
                        <label className="" htmlFor="backCamera">Camera trước</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                               id="frontCamera"
                               onChange={(e) => handleOnChange(e)}
                               value={productPhoneData.frontCamera}/>
                    </div>
                    <div className="">
                        <label className="" htmlFor="chip">Chip</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300`}

                               id="chip"
                               onChange={(e) => handleOnChange(e)}
                               value={productPhoneData.chip}/>
                    </div>
                    <div className="">
                        <label className="" htmlFor="ram">Ram</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300`}

                               id="ram"
                               onChange={(e) => handleOnChange(e)}
                               value={productPhoneData.ram}/>
                    </div>
                    <div className="">
                        <label className="" htmlFor="rom">Rom</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300`}

                               id="rom"
                               onChange={(e) => handleOnChange(e)}
                               value={productPhoneData.rom}/>
                    </div>
                    <div className="">
                        <label className="" htmlFor="sim">Sim</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300`}

                               id="sim"
                               onChange={(e) => handleOnChange(e)}
                               value={productPhoneData.sim}/>
                    </div>
                    <div className="">
                        <label className="" htmlFor="batteryCharger">Sạc pin</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300`}

                               id="batteryCharger"
                               onChange={(e) => handleOnChange(e)}
                               value={productPhoneData.batteryCharger}/>
                    </div>
                    <div className="">
                        {
                            !productPhoneData.new &&
                            <button
                                className="px-2 py-1 text-black border border-black text-sm bg-red-300 rounded-md"
                                onClick={handleOpenDelete}
                            >
                                Xoá thông số điện thoại
                            </button>
                        }
                    </div>
                    <div className="">
                        <button
                            className="px-2 py-1 text-black border border-black text-sm bg-green-400 rounded-md"
                            onClick={() => handleOnSave()}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
            {
                visibleConfirmDelete &&
                <ConfirmDeleteProductParameter visible={visibleConfirmDelete} onAbortDelete={handleOnAbortDelete}
                                               onDelete={handleOnDelete}/>
            }
        </div>
    );
}
