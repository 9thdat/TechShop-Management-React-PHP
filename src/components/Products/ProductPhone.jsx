import React, {useState, useEffect} from "react";

export default function ProductPhone({visible, onClose, data, action, onSave}) {
    const [productPhoneData, setProductPhoneData] = useState({});

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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Thông số điện thoại</div>
                    <button onClick={() => {
                        onClose();
                    }}>X
                    </button>
                </div>

                <div className="content">
                    <form className="form overflow-auto">
                        <table className="col-span-3">
                            <tr>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="screen">Màn hình</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="screen"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productPhoneData.screen}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="operatingSystem">Hệ điều hành</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="operatingSystem"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productPhoneData.operatingSystem}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="backCamera">Camera sau</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="backCamera"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productPhoneData.backCamera}/>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="backCamera">Camera trước</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="frontCamera"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productPhoneData.frontCamera}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="chip">Chip</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="chip"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productPhoneData.chip}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="ram">Ram</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="ram"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productPhoneData.ram}/>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="rom">Rom</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="rom"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productPhoneData.rom}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="sim">Sim</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="sim"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productPhoneData.sim}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="batteryCharger">Sạc pin</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="batteryCharger"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productPhoneData.batteryCharger}/>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        <div className="form-group flex justify-end">
                            <button
                                type="button"
                                className="btn btn-primary border border-green-500 bg-green-500 rounded-md p-2"
                                onClick={() => handleOnSave()}
                            >
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
