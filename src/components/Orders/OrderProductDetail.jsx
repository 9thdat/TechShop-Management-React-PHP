import React, {useState, useEffect} from "react";
import axios from "../../api/axios";

export default function OrderProductDetail({visible, onClose, data, action}) {
    const [orderProducts, setOrderProducts] = useState([]);
    const [orderProduct, setOrderProduct] = useState({});
    const [orderProductsLength, setOrderProductsLength] = useState(3);
    const [currentOrderProduct, setCurrentOrderProduct] = useState(0);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        setOrderProduct({
            productId: "",
            color: "",
            quantity: "",
            price: "",
            totalPrice: "",
        });
    }, []);

    const handleOnChange = (e) => {
        const {id, value} = e.target;

        setOrderProduct(
            (prevData) => ({
                ...prevData,
                [id]: value,
            })
        )
    }

    useEffect(() => {
        setOrderProduct({
            ...orderProduct,
            totalPrice: orderProduct.price * orderProduct.quantity,
        })
    }, [orderProduct.quantity]);

    const handleOnSave = async () => {

    }

    const setProductsData = async () => {
        const productsQuantityData = await fetchProductQuantity();
        setProducts(productsQuantityData);

        const productData = await fetchProduct();
        setOrderProduct({
            ...orderProduct,
            price: productData.price,
        })
    }

    const fetchLastId = async () => {
        try {
            const response = await axios.get("/OrderProductDetail/GetLastId");
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    const fetchProductQuantity = async () => {
        try {
            const response = await axios.get(`/ProductQuantity/ProductId=${orderProduct.productId}`);
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/Product/${orderProduct.productId}`);
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    const handleDisplayOrderProduct = (e) => {
        const {value} = e.target;

        setCurrentOrderProduct(value);

        let console = () => {
            console.log(currentOrderProduct);
        };
    };


    const handleOnAddOrderProduct = () => {
        setOrderProductsLength(
            (prevState) => prevState + 1
        )
    }

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
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
                                        {Array.from(Array(orderProductsLength + 1).keys())
                                            .filter(stt => stt !== 0) // Lọc bỏ giá trị 0
                                            .map((stt, index) => (
                                                <option
                                                    key={index}
                                                    value={stt + 1}
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
                                    />
                                </td>
                                <td>
                                    <label htmlFor="color">Màu sắc</label>
                                    <select
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        id="color"
                                        onChange={(e) => handleOnChange(e)}
                                        value={orderProduct.color}
                                        defaultValue={""}
                                    >
                                        <option value={""}></option>
                                        {products &&
                                            products.map((product, index) => (
                                                <option
                                                    key={index}
                                                    value={product.color}
                                                >
                                                    {product.color}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="quantity">Số lượng</label>
                                    <select
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        id="quantity"
                                        onChange={(e) => handleOnChange(e)}
                                        value={orderProduct.quantity}
                                        defaultValue={""}
                                    >
                                        <option value={""}></option>
                                        {orderProduct.color &&
                                            Array.from(
                                                Array(products.find(product => product.color === orderProduct.color).quantity + 1).keys()
                                            )
                                                .filter(quantity => quantity !== 0) // Lọc bỏ giá trị 0
                                                .map((quantity, index) => (
                                                    <option
                                                        key={index}
                                                        value={quantity}
                                                    >
                                                        {quantity}
                                                    </option>
                                                ))
                                        }
                                    </select>
                                </td>
                                <td>
                                    <label htmlFor="price">Giá tiền</label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2"
                                        id="price"
                                        onChange={(e) => handleOnChange(e)}
                                        value={orderProduct.price}
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
                                        onChange={(e) => handleOnChange(e)}
                                        value={orderProduct.totalPrice}
                                        disabled={true}
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
    );
}