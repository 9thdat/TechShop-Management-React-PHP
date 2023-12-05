import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

export default function ProductQuantity({ visible, onClose, data, action }) {
    const [originalProductQuantityData, setOriginalProductQuantityData] = useState([]);
    const [productQuantityData, setProductQuantityData] = useState([]);

    useEffect(() => {
        setOriginalProductQuantityData(data);
        setProductQuantityData(data);
    }, [data]);


    const handleOnChange = (e, index) => {
        const { id, value } = e.target;
        setProductQuantityData((prevData) =>
            prevData.map((item, i) =>
                i === index ? { ...item, [id]: value } : item
            )
        );
    };

    const handleOnSave = async () => {
        try {
            let success = 1;

            if (action === "edit") {
            for (let i = 0; i < productQuantityData.length; i++) {
                const response = await axios.put(`/ProductQuantity/Id=${productQuantityData[i].id}&color=${productQuantityData[i].color}&quantity=${productQuantityData[i].quantity}`);

                if (response.status !== 200) {
                    success = 0;
                }
            }
                }

            else {
                console.log(productQuantityData[0]);
                const response = await axios.post(`/ProductQuantity/id=${productQuantityData[0].id}&productId=${productQuantityData[0].productId}&color=${productQuantityData[0].color}&quantity=${productQuantityData[0].quantity}`);

                if (response.status !== 200) {
                    success = 0;
                }
            }
            if (success === 1) {
                alert("Cập nhật số lượng sản phẩm thành công!");
            }
            else {
                alert("Cập nhật số lượng sản phẩm thất bại!");
            }

            onClose();
            // Reset productQuantityData to the original state
            setProductQuantityData(originalProductQuantityData);
        } catch (err) {
            console.log(err);
        }
    };

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Chi tiết số lượng sản phẩm</div>
                    <button onClick={() => { onClose(); setProductQuantityData(originalProductQuantityData); }}>X</button>
                </div>

                <div className="content">
                    <form className="form overflow-auto">
                        <table className="col-span-3">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Mã sản phẩm</th>
                                    <th>Màu sắc</th>
                                    <th>Số lượng</th>
                                </tr>
                            </thead>
                            <tbody>
                            {   productQuantityData.map((productQuantity, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                                    id="id"
                                                    onChange={(e) => handleOnChange(e, index)}
                                                    disabled
                                                    value={productQuantity.id}
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                                    id="productId"
                                                    onChange={(e) => handleOnChange(e, index)}
                                                    disabled
                                                    value={productQuantity.productId}
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                                    id="color"
                                                    onChange={(e) => handleOnChange(e, index)}
                                                    value={productQuantity.color}
                                                />
                                            </td>

                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2"
                                                    id="quantity"
                                                    onChange={(e) => handleOnChange(e, index)}
                                                    value={productQuantity.quantity}
                                                />
                                            </td>
                                        </tr>
                                    ))
                            }
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
    );
}
