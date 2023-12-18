import React, {useState, useEffect, useMemo, useRef, useCallback} from "react";
import axios from "../../api/axios";

export default function OrderProductDetail({visible, onClose, order, action, onSave, orderDetail}) {
    const [orderProducts, setOrderProducts] = useState([]);
    const [orderProduct, setOrderProduct] = useState({
        id: 0,
        productId: "",
        color: "",
        quantity: 0,
        price: 0,
        totalPrice: 0,
    });

    const [orderProductsLength, setOrderProductsLength] = useState(0);
    const [currentOrderProduct, setCurrentOrderProduct] = useState("");
    const [productQuantity, setProductQuantity] = useState([]);
    const [totalProductQuantity, setTotalProductQuantity] = useState(0);
    const [isValid, setIsValid] = useState({
        productId: true,
        color: true,
        quantity: true,
    });

    useEffect(() => {
        console.log(isValid);
    }, [isValid]);

    useEffect(() => {
        setOrderProducts((prevOrderProducts) => {
            const orderProducts = [...prevOrderProducts];
            orderProducts[currentOrderProduct - 1] = {
                productId: orderProduct.productId,
                color: orderProduct.color,
                quantity: orderProduct.quantity,
                price: orderProduct.price,
                totalPrice: orderProduct.totalPrice,
            };
            return orderProducts;
        });
    }, [orderProduct]);

    useEffect(() => {
        calculateTotalPrice();

        return () => {
            console.log("Calculate total price");
        }
    }, [orderProduct.price, orderProduct.quantity]);

    useEffect(() => {
        setOrderProduct(
            {
                productId: orderDetail.productId,
                color: orderDetail.color,
                quantity: orderDetail.quantity,
                price: orderDetail.price,
                totalPrice: orderDetail.totalPrice,
            }
        )
        setOrderProducts(orderDetail);
        setOrderProductsLength(orderDetail.length);

        return () => {
            console.log("Set order products");
        }
    }, [orderDetail]);

    const handleOnChange = useCallback(async (e) => {
        const {id, value} = e.target;
        let price = 0;
        let totalPrice = 0;

        if (id === "productId" && value !== "") {
            setOrderProduct((prevOrderProduct) => ({
                ...prevOrderProduct,
                productId: value,
            }));

            const fetchData = async () => {
                try {
                    const productData = await fetchProductQuantity(value);
                    if (Array.isArray(productData)) {
                        setProductQuantity(productData);
                    } else {
                        setProductQuantity([]);
                    }

                    if (productData.length === 0) {
                        setIsValid((prevState) => ({
                            ...prevState,
                            productId: false,
                        }));
                    } else {
                        setIsValid((prevState) => ({
                            ...prevState,
                            productId: true,
                        }));
                    }
                } catch (err) {
                    console.error(err);
                }
            };

            await fetchData();
        } else if (id === "color") {
            const fetchData = async () => {
                try {
                    const totalProductQuantity = await fetchTotalProductQuantity(orderProduct.productId, value);
                    setTotalProductQuantity(totalProductQuantity);

                    const productData = await fetchProduct(orderProduct.productId);
                    price = Number(productData.price);
                    totalPrice = price * Number(orderProduct.quantity);
                    setOrderProduct((prevOrderProduct) => ({
                        ...prevOrderProduct,
                        color: value,
                        price: price,
                        totalPrice: totalPrice,
                    }));

                    if (value === "") {
                        setIsValid((prevState) => ({
                            ...prevState,
                            color: false,
                        }));
                    } else {
                        setIsValid((prevState) => ({
                            ...prevState,
                            color: true,
                        }));
                    }
                } catch (err) {
                    console.error(err);
                }
            };

            await fetchData();
        } else if (id === "quantity") {
            const quantityValue = Number(value);
            const productData = await fetchProduct(orderProduct.productId);
            totalPrice = Number(productData.price) * quantityValue;

            setOrderProduct((prevOrderProduct) => ({
                ...prevOrderProduct,
                quantity: quantityValue,
                totalPrice: totalPrice,
            }));

            if (typeof (quantityValue) !== "number" || quantityValue > totalProductQuantity) {
                setIsValid((prevState) => ({
                    ...prevState,
                    quantity: false,
                }));
            } else {
                setIsValid((prevState) => ({
                    ...prevState,
                    quantity: true,
                }));
            }
        } else {
            setOrderProduct((prevOrderProduct) => ({
                ...prevOrderProduct,
                [id]: value,
            }));
        }
    }, [orderProduct.productId, orderProduct.price, orderProduct.quantity]);

    const calculateTotalPrice = () => {
        orderProduct.totalPrice = Number(orderProduct.price) * Number(orderProduct.quantity);
    };

    const fetchOrderDetail = async () => {
        try {
            const response = await axios.get(`/OrderDetail/OrderId=${order.id}`);
            return response.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const setProductsData = async () => {
        if (orderProduct.productId === "") {
            return;
        }

        try {
            const productsQuantityData = await fetchProductQuantity(orderProduct.productId);
            setProductQuantity(productsQuantityData);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchLastId = async () => {
        try {
            const response = await axios.get("/OrderDetail/GetLastId");
            return response.data;
        } catch (err) {
            console.error(err);
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

    const fetchProduct = async (productId) => {
        try {
            const response = await axios.get(`/Product/${productId}`);
            return response.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    };

    const fetchTotalProductQuantity = async (productId, color) => {
        if (productId === "" || color === "") {
            return 0;
        }

        try {
            const response = await axios.get(`/ProductQuantity/TotalQuantity/ProductId=${productId}&ProductColor=${color}`);
            return response.data;
        } catch (err) {
            console.error(err);
            return 0;
        }
    };

    const handleDisplayOrderProduct = async (e) => {
        const {value} = e.target;

        if (value === "") {
            setCurrentOrderProduct(() => value);

            setOrderProduct({
                productId: "",
                color: "",
                quantity: "",
                price: "",
                totalPrice: "",
            });
        } else {
            const totalProductQuantity = await fetchTotalProductQuantity(orderProducts[value - 1].productId, orderProducts[value - 1].color);
            setTotalProductQuantity(totalProductQuantity);
            setCurrentOrderProduct(() => value);

            if (orderProducts[value - 1]) {
                setOrderProduct({
                    productId: orderProducts[value - 1].productId,
                    color: orderProducts[value - 1].color,
                    quantity: orderProducts[value - 1].quantity,
                    price: orderProducts[value - 1].price,
                    totalPrice: orderProducts[value - 1].totalPrice,
                });

                const productQuantityData = await fetchProductQuantity(orderProducts[value - 1].productId);
                setProductQuantity(productQuantityData);
            }
        }
    };


    const handleOnAddOrderProduct = async () => {
        const lastId = await fetchLastId();
        setOrderProductsLength((prevState) => prevState + 1);
        setOrderProducts((prevState) => [
            ...prevState,
            {
                id: lastId + 1,
                productId: "",
                color: "",
                quantity: "",
                price: "",
                totalPrice: "",
            },
        ]);
    };

    const handleOnSave = () => {
        if (isValid.productId && isValid.color && isValid.quantity) {
            onSave(orderProducts);
            console.log(orderProducts);
            onClose();
        } else {
            alert("Vui lòng nhập đúng thông tin");
        }
    };

    const handleOnDeleteProduct = () => {
        if (orderProductsLength !== 0 && currentOrderProduct !== "") {
            const indexToDelete = currentOrderProduct - 1;

            if (indexToDelete >= 0 && indexToDelete < orderProductsLength) {
                setOrderProducts((prevState) => prevState.filter((_, index) => index !== indexToDelete));
                setOrderProductsLength((prevState) => prevState - 1);

                if (indexToDelete === orderProductsLength - 1) {
                    setCurrentOrderProduct((prevState) => prevState - 1);

                    setOrderProduct({
                            productId: orderProducts[indexToDelete - 1]?.productId || "",
                            color: orderProducts[indexToDelete - 1]?.color || "",
                            quantity: orderProducts[indexToDelete - 1]?.quantity || "",
                            price: orderProducts[indexToDelete - 1]?.price || "",
                            totalPrice: orderProducts[indexToDelete - 1]?.totalPrice || "",
                        }
                    );
                } else {
                    setCurrentOrderProduct((prevState) => prevState);

                    setOrderProduct({
                        productId: orderProducts[indexToDelete]?.productId || "",
                        color: orderProducts[indexToDelete]?.color || "",
                        quantity: orderProducts[indexToDelete]?.quantity || "",
                        price: orderProducts[indexToDelete]?.price || "",
                        totalPrice: orderProducts[indexToDelete]?.totalPrice || "",
                    });
                }
            }
        }
    };


    if (!visible) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Chi tiết sản phẩm của đơn hàng</div>
                    <button onClick={onClose}>X</button>
                </div>

                <div className="content">
                    <form className="form overflow-auto">
                        <table className="col-span-2">
                            <thead>
                            <tr>
                                <td>
                                    <label htmlFor={"stt"}>Sản phẩm thứ </label>
                                    <select
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        id="stt"
                                        onChange={(e) => handleDisplayOrderProduct(e)}
                                        defaultValue={""}
                                        value={currentOrderProduct}
                                    >
                                        <option value={""}></option>
                                        {
                                            orderProductsLength !== null &&
                                            Array.from(Array(orderProductsLength + 1).keys())
                                                .filter(stt => stt !== 0) // Lọc bỏ giá trị 0
                                                .map((stt, index) => (
                                                    <option
                                                        key={index}
                                                        value={stt}
                                                    >
                                                        {stt}
                                                    </option>
                                                ))
                                        }

                                    </select>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-primary border border-green-500 bg-amber-400 rounded-md p-2"
                                        onClick={handleOnAddOrderProduct}
                                        disabled={action === "edit"}
                                    >
                                        Thêm một sản phẩm
                                    </button>
                                </td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <label htmlFor="productId">Mã sản phẩm</label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        id="productId"
                                        onChange={(e) => handleOnChange(e)}
                                        onBlur={setProductsData}
                                        value={orderProduct.productId}
                                        disabled={currentOrderProduct === "" || action === "edit"}
                                    />
                                    {!isValid.productId && (
                                        <h5 className="text-red-500 text-xs">"Mã sản phẩm không tồn tại"</h5>
                                    )}
                                </td>
                                <td>
                                    <label htmlFor="color">Màu sắc</label>
                                    <select
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        id="color"
                                        onChange={(e) => handleOnChange(e)}
                                        value={orderProduct.color}
                                        disabled={currentOrderProduct === "" || action === "edit"}
                                    >
                                        <option value={""}></option>
                                        {
                                            productQuantity &&
                                            productQuantity.map((product, index) => (
                                                <option
                                                    key={index}
                                                    value={product.color}
                                                >
                                                    {product.color}
                                                </option>
                                            ))
                                        }
                                    </select>
                                    {!isValid.color && (
                                        <h5 className="text-red-500 text-xs">"Màu sắc không hợp lệ"</h5>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="quantity">Số lượng</label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2"
                                        id="quantity"
                                        onChange={(e) => handleOnChange(e)}
                                        value={orderProduct.quantity || ""}
                                        disabled={currentOrderProduct === "" || action === "edit"}
                                    />
                                    <span
                                        className="text-red-500 text-xs"
                                    >
                                        Còn lại: {totalProductQuantity}
                                    </span>
                                    {!isValid.quantity && (
                                        <h5 className="text-red-500 text-xs">"Số lượng không hợp lệ"</h5>
                                    )}
                                </td>
                                <td>
                                    <label htmlFor="price">Giá tiền</label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2"
                                        id="price"
                                        value={orderProduct.price || ""}
                                        disabled={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="totalPrice">Tổng tiền</label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2"
                                        id="totalPrice"
                                        value={orderProduct.totalPrice || ""}
                                        disabled={true}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="form-group flex justify-between">
                            <button
                                type="button"
                                className="btn btn-primary border border-green-500 bg-red-400 rounded-md p-2"
                                onClick={handleOnDeleteProduct}
                                disabled={action === "edit"}
                            >
                                Xóa sản phẩm
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
