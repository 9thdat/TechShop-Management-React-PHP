import React, {useState, useEffect} from "react";
import axios from "../../api/axios";
import ProductImage from "./ProductImage";

export default function ProductQuantity({visible, onClose, data, action, onSave}) {
    const [productQuantityData, setProductQuantityData] = useState([]);
    const [productQuantity, setProductQuantity] = useState([]);
    const [isValid, setIsValid] = useState(true);

    const [visibleProductImage, setVisibleProductImage] = useState(false);
    const [originalProductImage, setOriginalProductImage] = useState([]);
    const [productImageData, setProductImageData] = useState([]);
    const [actionProductImage, setActionProductImage] = useState("");

    useEffect(() => {
        if (action === "edit") {
            setProductQuantityData(
                data.map((item) => ({
                        ...item,
                        quantityValid: true,
                    })
                )
            );
        } else {
            setProductQuantityData(data);
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
        }
    };

    const handleOnAddProductQuantity = () => {
        setProductQuantityData((prevData) => [
            ...prevData,
            {
                id: "",
                productId: data[0].productId,
                color: "",
                quantity: 0,
                quantityValid: true,
            },
        ]);
    }

    const handleOnSave = () => {
        if (!isValid) {
            alert("Vui lòng nhập đầy đủ thông tin");
        } else {
            onSave(productQuantityData, originalProductImage);
            onClose();
        }
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
                                (product.isDeleted === false || product.isDeleted === undefined) && (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                                id="color"
                                                onChange={(e) => handleOnChange(e, index)}
                                                value={product.color}
                                            />
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
                                                className="btn btn-primary border border-green-500 bg-amber-200 rounded-md p-1 text-xl"
                                                onClick={(e) => handleOpenDetailImage(e, index)}
                                            >
                                                Chi tiết hình ảnh
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger border border-red-400 bg-red-500 rounded-md p-1 text-xl"
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
