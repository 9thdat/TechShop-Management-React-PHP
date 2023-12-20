import React, {useState, useEffect, useRef} from "react";

export default function ProductCable({visible, onClose, data, action, onSave}) {
    const [productCable, setProductCable] = useState({});

    useEffect(() => {
        setProductCable(data);
    }, [data]);


    const handleOnChange = (e) => {
        const {id, value} = e.target;
        setProductCable(
            {
                ...productCable,
                [id]: value
            }
        );
    }

    const handleOnSave = () => {
        onSave(productCable);
        onClose();
    }

    if (!visible) return null;
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Chi tiết thông số cáp</div>
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
                                    <label htmlFor="tech" className={"mr-2"}>Công nghệ</label>
                                    <input
                                        type="text"
                                        name="tech"
                                        id="tech"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        value={productCable.tech}
                                        onChange={(e, index) => handleOnChange(e)}
                                    />
                                </td>

                                <td>
                                    <label htmlFor="function" className={"mr-2"}>Tính năng</label>
                                    <input
                                        type="text"
                                        name="function"
                                        id="function"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        value={productCable.function}
                                        onChange={(e, index) => handleOnChange(e)}
                                    />
                                </td>

                                <td>
                                    <label htmlFor="input" className={"mr-2"}>Đầu vào</label>
                                    <input
                                        type="text"
                                        name="input"
                                        id="input"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        value={productCable.input}
                                        onChange={(e, index) => handleOnChange(e)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="output" className={"mr-2"}>Đầu ra</label>
                                    <input
                                        type="text"
                                        name="output"
                                        id="output"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        value={productCable.output}
                                        onChange={(e, index) => handleOnChange(e)}
                                    />
                                </td>

                                <td>
                                    <label htmlFor="length" className={"mr-2"}>Chiều dài</label>
                                    <input
                                        type="text"
                                        name="length"
                                        id="length"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        value={productCable.length}
                                        onChange={(e, index) => handleOnChange(e)}
                                    />
                                </td>

                                <td>
                                    <label htmlFor="maximum" className={"mr-2"}>Công suất</label>
                                    <input
                                        type="text"
                                        name="maximum"
                                        id="maximum"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        value={productCable.maximum}
                                        onChange={(e, index) => handleOnChange(e)}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label htmlFor="madein" className={"mr-2"}>Nước sản xuất</label>
                                    <input
                                        type="text"
                                        name="madein"
                                        id="madein"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        value={productCable.madein}
                                        onChange={(e, index) => handleOnChange(e)}
                                    />
                                </td>

                                <td>
                                    <label htmlFor="brandof" className={"mr-2"}>Nhà phân phối</label>
                                    <input
                                        type="text"
                                        name="brandof"
                                        id="brandof"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        value={productCable.brandof}
                                        onChange={(e, index) => handleOnChange(e)}
                                    />
                                </td>

                                <td>
                                    <label htmlFor="brand" className={"mr-2"}>Hãng</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        id="brand"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        value={productCable.brand}
                                        onChange={(e, index) => handleOnChange(e)}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="form-group flex justify-end">
                            <button
                                type="button"
                                className="btn btn-primary border border-green-500 bg-green-500 rounded-md p-2"
                                onClick={handleOnSave}
                            >
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}