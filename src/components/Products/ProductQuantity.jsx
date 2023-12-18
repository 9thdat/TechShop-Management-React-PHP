import React, {useState, useEffect} from "react";
import axios from "../../api/axios";

export default function ProductQuantity({visible, onClose, data, action}) {
    const [productQuantityData, setProductQuantityData] = useState([]);
    const [productQuantity, setProductQuantity] = useState([]);
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        setProductQuantityData(
            data.map((item) => ({
                    ...item,
                    colorValid: true,
                    quantityValid: true,
                })
            )
        );
        console.log(data);

        fetchProductQuantity(data[0].productId).then((res) => {
                setProductQuantity(res);
            }
        );
    }, [data]);

    const handleOnChange = (e, index) => {
        const {id, value} = e.target;
        setProductQuantityData((prevData) =>
            prevData.map((item, i) =>
                i === index ? {...item, [id]: value} : item
            )
        );

        if (id === "quantity") {
            if (value === "") {
                setProductQuantityData((prevData) =>
                    prevData.map((item, i) =>
                        i === index ?
                            {
                                ...item,
                                quantityValid: false,
                            }
                            :
                            item
                    )
                );
                setIsValid(false);
            } else {
                setProductQuantityData((prevData) =>
                    prevData.map((item, i) =>
                        i === index ?
                            {
                                ...item,
                                quantityValid: true,
                            }
                            :
                            item
                    )
                );
                setIsValid(true);
            }
        } else if (id === "color") {
            const isColorExist = productQuantityData.some(
                (item, i) => i !== index && item.color === value
            );

            setProductQuantityData((prevData) =>
                prevData.map((item, i) =>
                    i === index
                        ? {
                            ...item,
                            colorValid: !isColorExist,
                        }
                        : item
                )
            );

            setIsValid(!isColorExist);
        }
    };

    const handleOnAddProductQuantity = () => {
        setProductQuantityData((prevData) => [
            ...prevData,
            {
                id: "",
                productId: data[0].productId, // data[0] is the first product in the list of products
                color: "",
                quantity: "",
            },
        ]);
    }

    const handleOnSave = () => {
        console.log(productQuantityData);
        data = productQuantityData;
    };

    const fetchProductQuantity = async (productId) => {
        if (productId === "") {
            return [];
        }
        try {
            const response = await axios.get(`/ProductQuantity/ProductId=${productId}`);
            return response.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    if (!visible) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Chi tiết số lượng sản phẩm</div>
                    <button onClick={() => {
                        onClose();
                    }}>X
                    </button>
                </div>

                <div className="content">
                    <form className="form overflow-auto">
                        <table className="col-span-3">
                            <thead>
                            <tr>
                                <th>Màu sắc</th>
                                <th>Số lượng</th>
                            </tr>
                            </thead>
                            <tbody>
                            {productQuantityData.map((product, index) => (
                                <tr key={index}>
                                    <td>
                                        <select
                                            className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                            id="color"
                                            onChange={(e) => handleOnChange(e, index)}
                                            value={product.color}
                                        >
                                            {
                                                productQuantity.map((item) => (
                                                    <option key={item.id} value={item.color}>
                                                        {item.color}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                        <span>
                                            {
                                                !product.colorValid ? (
                                                    <h5 className="text-red-500 text-xs">Màu sắc đã tồn tại</h5>
                                                ) : null
                                            }
                                        </span>
                                    </td>

                                    <td>
                                        <input
                                            type="text"
                                            className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                            id="quantity"
                                            onChange={(e) => handleOnChange(e, index)}
                                            value={product.quantity}
                                        />
                                        <span>
                                            {
                                                !product.quantityValid ? (
                                                    <h5 className="text-red-500 text-xs">Vui lòng nhập đầy đủ thông
                                                        tin</h5>
                                                ) : null
                                            }
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-danger border border-red-400 bg-red-500 rounded-md p-1 text-xl"
                                            onClick={() => {
                                                setProductQuantityData((prevData) =>
                                                    prevData.filter((item, i) => i !== index)
                                                );
                                            }}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                            }
                            </tbody>
                        </table>


                        <div className="form-group flex justify-between">
                            <button
                                type="button"
                                className="btn btn-danger border border-red-500 bg-blue-300 rounded-md p-2 mr-2"
                                onClick={handleOnAddProductQuantity}
                            >
                                Thêm số lượng sản phẩm
                            </button>
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
