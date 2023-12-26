import React, {useState, useEffect} from "react";
import axios from "../../api/axios";
import ProductImage from "./ProductImage";

export default function ProductQuantity({visible, onClose, data, action, onSave}) {
    const [productQuantityData, setProductQuantityData] = useState([]);
    const [productQuantity, setProductQuantity] = useState([]);

    const [visibleProductImage, setVisibleProductImage] = useState(false);
    const [originalProductImage, setOriginalProductImage] = useState([]);
    const [productImageData, setProductImageData] = useState([]);
    const [actionProductImage, setActionProductImage] = useState("");

    useEffect(() => {
        if (action === "edit") {
            setProductQuantityData(
                data.map((item) => ({
                        ...item,
                        quantityValid: false,
                        colorValid: false,
                        newQuantity: true,
                        newColor: true,
                    })
                )
            );
        } else {
            setProductQuantityData([]);
        }
    }, [data]);

    useEffect(() => {
        if (action === "edit") {
            fetchProductImage(data[0].productId).then((res) => {
                    setOriginalProductImage(res);
                }
            );
        }
    }, []);

    const handleOnChange = (e, index) => {
        const {id, value} = e.target;
        setProductQuantityData((prevData) =>
            prevData.map((item, i) =>
                i === index ? {...item, [id]: value} : item
            )
        );
    };

    const handleOnAddProductQuantity = () => {
        setProductQuantityData((prevData) => [
            ...prevData,
            {
                id: "",
                productId: "",
                color: "",
                quantity: 0,
                quantityValid: false,
                colorValid: false,
                newQuantity: true,
                newColor: true,
            },
        ]);
    }

    const handleOnSave = () => {
        if (!productQuantityData.every((item) => item.colorValid && item.quantityValid)) {
            alert("Vui lòng nhập đầy đủ thông tin");
        } else {
            onSave(productQuantityData, originalProductImage);
            onClose();
        }
    };

    const handleOpenDetailImage = (e, index) => {
        const product = productQuantityData[index];

        originalProductImage.map((item) => {
            if (item.color === product.color) {
                productImageData.push(item);
            }
        });

        if (productImageData.length === 0) {
            setProductImageData([{
                id: "",
                productId: product.productId,
                color: product.color,
                image: "",
                ordinal: "",
            }]);
            setActionProductImage("add");
        } else {
            setActionProductImage("edit");
        }
        setVisibleProductImage(true);
    }

    const handleOnCloseProductImage = () => {
        setVisibleProductImage(false);
        setProductImageData([]);
    }

    const handleOnSaveProductImage = (productImageData) => {
        setOriginalProductImage((prevData) => {
            // Filter out the item with the matching color from originalProductImage
            const updatedOriginalProductImage = prevData.filter((item) => item.color !== productImageData[0].color);

            // Concatenate the elements of productImageData to updatedOriginalProductImage
            return [...updatedOriginalProductImage, ...productImageData];
        });


        setVisibleProductImage(false);
    };

    const fetchProductImage = async (productId) => {
        if (productId === "") {
            return [];
        }
        try {
            const response = await axios.get(`/ImageDetail/ProductId=${productId}`);
            return response.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const handleOnDeleteProductQuantity = (e, index) => {
        setProductQuantityData((prevData) =>
            prevData.map((item, i) =>
                i === index ?
                    {
                        ...item,
                        isDeleted: true,
                    }
                    :
                    item
            )
        );
    }

    const handleValidField = (e, index) => {
        const {id, value} = e.target;

        if (id === "color") {
            setProductQuantityData((prevData) =>
                prevData.map((item, i) =>
                    i === index ?
                        {
                            ...item,
                            colorValid: value !== "",
                            newColor: false,
                        }
                        :
                        item
                )
            );
        }

        if (id === "quantity") {
            setProductQuantityData((prevData) =>
                prevData.map((item, i) =>
                    i === index ?
                        {
                            ...item,
                            quantityValid: value !== "",
                            newQuantity: false,
                        }
                        :
                        item
                )
            );
        }
    };

    if (!visible) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-3xl"
        >
            <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                    <div className="">Chi tiết số lượng sản phẩm</div>
                    <button onClick={() => {
                        onClose();
                    }}>X
                    </button>
                </div>
                <div className="overflow-x-auto overflow-y-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead>
                        <tr>
                            <th scope="col" className="text-center">
                                Màu sắc
                            </th>
                            <th scope="col" className="text-center">
                                Số lượng
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            productQuantityData.map((product, index) => (
                                (product.isDeleted === false || product.isDeleted === undefined) && (
                                    <tr key={index} className={""}>
                                        <td colSpan={1}>
                                            <input
                                                type="text"
                                                className={`border border-black rounded-md text-center block disabled:bg-gray-300 mx-1`}
                                                id="color"
                                                onBlur={(e) => handleValidField(e, index)}
                                                onChange={(e) => handleOnChange(e, index)}
                                                value={product.color}
                                            />
                                            <span>
                                                {
                                                    (!product.colorValid && !product.newColor) ? (
                                                        <h5 className="text-red-500 text-xs">Vui lòng nhập đầy đủ thông
                                                            tin</h5>
                                                    ) : null
                                                }
                                            </span>
                                        </td>

                                        <td colSpan={1}>
                                            <input
                                                type="text"
                                                className={`border border-black rounded-md text-center block disabled:bg-gray-300 mx-1`}
                                                id="quantity"
                                                onBlur={(e) => handleValidField(e, index)}
                                                onChange={(e) => handleOnChange(e, index)}
                                                value={product.quantity}
                                            />
                                            <span>
                                                {
                                                    (!product.quantityValid && !product.newQuantity) ? (
                                                        <h5 className="text-red-500 text-xs">Vui lòng nhập đầy đủ thông
                                                            tin</h5>
                                                    ) : null
                                                }
                                            </span>
                                        </td>
                                        <td colSpan={1}>
                                            <button
                                                type="button"
                                                className="px-2 py-1 text-black bg-yellow-200 rounded-md text-sm mx-1"
                                                onClick={(e) => handleOpenDetailImage(e, index)}
                                            >
                                                Ảnh
                                            </button>
                                        </td>
                                        <td colSpan={1}>
                                            <button
                                                type="button"
                                                className="px-2 py-1 text-black bg-red-400 rounded-md"
                                                onClick={(e) => handleOnDeleteProductQuantity(e, index)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                )
                            ))
                        }
                        </tbody>
                    </table>

                    <div className="flex justify-between mt-2">
                        <button
                            type="button"
                            className="px-2 py-1 text-black border border-black text-sm bg-blue-200 rounded-md"
                            onClick={handleOnAddProductQuantity}
                        >
                            Thêm số lượng sản phẩm
                        </button>
                        <button
                            type="button"
                            className="px-2 py-1 text-black border border-black text-sm bg-green-400 rounded-md"
                            onClick={handleOnSave}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
            {
                visibleProductImage &&
                <ProductImage
                    visible={visibleProductImage}
                    data={productImageData}
                    onClose={handleOnCloseProductImage}
                    onSave={handleOnSaveProductImage}
                    action={actionProductImage}
                />
            }
        </div>
    );
}
