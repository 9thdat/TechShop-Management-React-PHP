import React, {useState, useEffect} from "react";
import axios from "../../api/axios";

export default function ProductPhone({visible, onClose, data, action}) {
    const [originalProductPhoneData, setOriginalProductPhoneData] = useState({});
    const [productPhoneData, setProductPhoneData] = useState({});

    useEffect(() => {
        setOriginalProductPhoneData(data);
        setProductPhoneData(data);
    }, [data]);

    const handleOnChange = (e, index) => {
        const {id, value} = e.target;
        setOriginalProductPhoneData((prevData) =>
            prevData.map((item, i) =>
                i === index ? {...item, [id]: value} : item
            )
        );
    };

    const handleOnSave = async () => {

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
                        setProductPhoneData(originalProductPhoneData);
                    }}>X
                    </button>
                </div>

                <div className="content">
                    <form className="form overflow-auto">
                        <table className="col-span-2">
                            <td>
                                <form className="form overflow-auto">
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="id">ID</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md disabled:bg-slate-200"
                                               id="id"
                                               onChange={(e) => handleOnChange(e)}
                                               disabled
                                               value={productPhoneData.id}/>
                                    </div>

                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="name">Id Sản phẩm</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="name"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productPhoneData.productId}/>
                                    </div>

                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="name">Màn hình</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="name"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productPhoneData.screen}/>
                                    </div>

                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="name">Hệ điều hành</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="name"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productPhoneData.operatingSystem}/>
                                    </div>
                                </form>
                            </td>
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
