import React, {useState, useEffect} from "react";
import ConfirmDeleteProductParameter from "./ConfirmDeleteProductParameter";
import axios from "../../api/axios";

export default function ProductAdapter({visible, onClose, onSave, data, action, onReload}) {
    const [productAdapter, setProductAdapter] = useState({});
    const [visibleConfirmDelete, setVisibleConfirmDelete] = useState(false);

    useEffect(() => {
        setProductAdapter(data);
    }, [data]);

    const handleOnChange = (e) => {
        const {id, value} = e.target;
        setProductAdapter(
            {
                ...productAdapter,
                [id]: value
            }
        );
    }

    const handleOnSave = () => {
        onSave(productAdapter);
        onClose();
    }

    const handleOpenDelete = () => {
        setVisibleConfirmDelete(true);
    }

    const handleOnDelete = async () => {
        try {
            const res = await axios.delete(`/ParameterAdapter/${productAdapter.id}`);
            if (res.status === 204) {
                alert("Xóa thông số cục sạc thành công!");
                onReload();
                setVisibleConfirmDelete(false);
                onClose();
            } else {
                alert("Xóa thông số cục sạc thất bại!");
                setVisibleConfirmDelete(false);
            }
        } catch (e) {
            alert("Xóa thông số cục sạc thất bại!");
            console.log(e);
            setVisibleConfirmDelete(false);
        }
    }

    const handleOnAbortDelete = () => {
        setVisibleConfirmDelete(false);
    }

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Chi tiết thông số cục sạc</div>
                    <button onClick={() => {
                        onClose();
                    }}>X
                    </button>
                </div>
                <div className="content">
                    <form className="form overflow-auto">
                        <table className="col-span-4">
                            <tbody>
                            <tr>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="model">Model</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="model"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productAdapter.model}/>
                                    </div>
                                </td>

                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="function">Tính năng</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="function"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productAdapter.function}/>
                                    </div>
                                </td>

                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="input">Đầu vào</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="input"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productAdapter.input}/>
                                    </div>
                                </td>

                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="output">Đầu ra</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="output"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productAdapter.output}/>
                                    </div>
                                </td>

                            </tr>
                            <tr>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="maximum">Công suất</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="maximum"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productAdapter.maximum}/>
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="size">Kích thước</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="size"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productAdapter.size}/>
                                    </div>
                                </td>

                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="tech">Công nghệ</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="tech"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productAdapter.tech}/>
                                    </div>
                                </td>

                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="madein">Nước sản xuất</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="madein"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productAdapter.madein}/>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={"2"}>
                                    <div className="form-group flex justify-end mb-4 ">
                                        <label className="mr-2" htmlFor="brandof">Nhà phân phối</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="brandof"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productAdapter.brandof}/>
                                    </div>
                                </td>

                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="brand">Hãng</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="brand"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productAdapter.brand}/>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="form-group flex justify-end">
                            {
                                !productAdapter.new &&
                                <button
                                    type="button"
                                    className="btn btn-danger border border-red-500 bg-red-300 rounded-md p-2 mr-2"
                                    onClick={handleOpenDelete}
                                >
                                    Xoá thông số cục sạc
                                </button>
                            }
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
            {
                visibleConfirmDelete &&
                <ConfirmDeleteProductParameter visible={visibleConfirmDelete} onAbortDelete={handleOnAbortDelete}
                                               onDelete={handleOnDelete}/>
            }
        </div>
    );
}