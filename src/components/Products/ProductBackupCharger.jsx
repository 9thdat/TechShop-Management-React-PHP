import React, {useState, useEffect} from "react";
import axios from "../../api/axios";
import ConfirmDeleteProductParameter from "./ConfirmDeleteProductParameter";

export default function ProductBackupCharger({visible, onClose, data, action, onSave, onReload}) {
    const [productBackupCharger, setProductBackupCharger] = useState({});
    const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);

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

    const handleOpenDelete = () => {
        setVisibleConfirmDelete(true);
    }

    const handleOnDelete = async () => {
        try {
            const res = await axios.delete(`/ParameterBackupCharger/${productBackupCharger.id}`);
            if (res.status === 204) {
                alert("Xóa thông số sạc dự phòng thành công!");
                onReload();
                setVisibleConfirmDelete(false);
                onClose();
            } else {
                alert("Xóa thông số sạc dự phòng thất bại!");
                setVisibleConfirmDelete(false);
            }
        } catch (e) {
            alert("Xóa thông số sạc dự phòng thất bại!");
            console.log(e);
            setVisibleConfirmDelete(false);
        }
    }

    const handleOnAbortDelete = () => {
        setVisibleConfirmDelete(false);
    }

    if (!visible) return null;
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm"
        >
            <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                    <div className="">Chi tiết thông số pin dự phòng</div>
                    <button onClick={() => {
                        onClose();
                    }}>X
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className=" ">
                        <label className="mr-2" htmlFor="efficiency">Hiệu suất</label>
                        <input type="text"
                               className="form-control border border-black rounded-md"
                               id="efficiency"
                               onChange={(e) => handleOnChange(e)}
                               value={productBackupCharger.efficiency}/>
                    </div>
                    <div className="">
                        <label className="mr-2" htmlFor="capacity">Dung lượng</label>
                        <input type="text"
                               className="form-control border border-black rounded-md"
                               id="capacity"
                               onChange={(e) => handleOnChange(e)}
                               value={productBackupCharger.capacity}/>
                    </div>
                    <div className=" ">
                        <label className="mr-2" htmlFor="timefullcharge">Thời gian sạc đầy</label>
                        <input type="text"
                               className="form-control border border-black rounded-md"
                               id="timefullcharge"
                               onChange={(e) => handleOnChange(e)}
                               value={productBackupCharger.timefullcharge}/>
                    </div>
                    <div className=" ">
                        <label className="mr-2" htmlFor="input">Đầu vào</label>
                        <input type="text"
                               className="form-control border border-black rounded-md"
                               id="input"
                               onChange={(e) => handleOnChange(e)}
                               value={productBackupCharger.input}/>
                    </div>
                    <div className=" ">
                        <label className="mr-2" htmlFor="output">Đầu ra</label>
                        <input type="text"
                               className="form-control border border-black rounded-md"
                               id="output"
                               onChange={(e) => handleOnChange(e)}
                               value={productBackupCharger.output}/>
                    </div>
                    <div className=" ">
                        <label className="mr-2" htmlFor="core">Lõi</label>
                        <input type="text"
                               className="form-control border border-black rounded-md"
                               id="core"
                               onChange={(e) => handleOnChange(e)}
                               value={productBackupCharger.core}/>
                    </div>
                    <div className=" ">
                        <label className="mr-2" htmlFor="tech">Công nghệ</label>
                        <input type="text"
                               className="form-control border border-black rounded-md"
                               id="tech"
                               onChange={(e) => handleOnChange(e)}
                               value={productBackupCharger.tech}/>
                    </div>
                    <div className=" ">
                        <label className="mr-2" htmlFor="size">Kích thước</label>
                        <input type="text"
                               className="form-control border border-black rounded-md"
                               id="size"
                               onChange={(e) => handleOnChange(e)}
                               value={productBackupCharger.size}/>
                    </div>
                    <div className=" ">
                        <label className="mr-2" htmlFor="weight">Trọng lượng</label>
                        <input type="text"
                               className="form-control border border-black rounded-md"
                               id="weight"
                               onChange={(e) => handleOnChange(e)}
                               value={productBackupCharger.weight}/>
                    </div>
                    <div className=" ">
                        <label className="mr-2" htmlFor="madein">Nước sản xuất</label>
                        <input type="text"
                               className="form-control border border-black rounded-md"
                               id="madein"
                               onChange={(e) => handleOnChange(e)}
                               value={productBackupCharger.madein}/>
                    </div>
                    <div className=" ">
                        <label className="mr-2" htmlFor="brandof">Nhà phân phối</label>
                        <input type="text"
                               className="form-control border border-black rounded-md"
                               id="brandof"
                               onChange={(e) => handleOnChange(e)}
                               value={productBackupCharger.brandof}/>
                    </div>
                    <div className=" ">
                        <label className="mr-2" htmlFor="brand">Hãng</label>
                        <input type="text"
                               className="form-control border border-black rounded-md"
                               id="brand"
                               onChange={(e) => handleOnChange(e)}
                               value={productBackupCharger.brand}/>
                    </div>
                    <div className="">
                        {
                            !productBackupCharger.new &&
                            <button
                                type="button"
                                className="px-2 py-1 text-black border border-black text-sm bg-red-300 rounded-md"
                                onClick={handleOpenDelete}
                            >
                                Xoá thông số sạc dự phòng
                            </button>
                        }
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
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