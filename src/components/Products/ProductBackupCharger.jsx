import React, {useState, useEffect} from "react";

export default function ProductBackupCharger({visible, onClose, data, action, onSave}) {
    const [productBackupCharger, setProductBackupCharger] = useState({});

    useEffect(() => {
        setProductBackupCharger(data);
    }, [data]);

    const handleOnChange = (e) => {
        const {id, value} = e.target;
        setProductBackupCharger(
            {
                ...productBackupCharger,
                [id]: value
            }
        );
    }

    const handleOnSave = () => {
        onSave(productBackupCharger);
        onClose();
    }

    if (!visible) return null;
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Chi tiết thông số pin dự phòng</div>
                    <button onClick={() => {
                        onClose();
                    }}>X
                    </button>
                </div>
                <div className="content">
                    <form className="form overflow-auto">
                        <table className="col-span-3">
                            <tbody>
                            <tr>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="efficiency">Hiệu suất</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="efficiency"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productBackupCharger.efficiency}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="capacity">Dung lượng</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="capacity"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productBackupCharger.capacity}/>
                                    </div>
                                </td>

                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="timefullcharge">Thời gian sạc đầy</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="timefullcharge"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productBackupCharger.timefullcharge}/>
                                    </div>
                                </td>


                            </tr>

                            <tr>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="input">Đầu vào</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="input"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productBackupCharger.input}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="output">Đầu ra</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="output"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productBackupCharger.output}/>
                                    </div>
                                </td>

                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="core">Lõi</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="core"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productBackupCharger.core}/>
                                    </div>
                                </td>


                            </tr>

                            <tr>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="tech">Công nghệ</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="tech"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productBackupCharger.tech}/>
                                    </div>
                                </td>

                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="size">Kích thước</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="size"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productBackupCharger.size}/>
                                    </div>
                                </td>

                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="weight">Trọng lượng</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="weight"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productBackupCharger.weight}/>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="madein">Nước sản xuất</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="madein"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productBackupCharger.madein}/>
                                    </div>
                                </td>

                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="brandof">Nhà phân phối</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="brandof"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productBackupCharger.brandof}/>
                                    </div>
                                </td>

                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="brand">Hãng</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="brand"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productBackupCharger.brand}/>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
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