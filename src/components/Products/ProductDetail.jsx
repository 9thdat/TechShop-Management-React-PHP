import React, {useState, useEffect} from "react";
import axios from "../../api/axios";
import productAdapter from "./ProductAdapter";
import productBackupCharger from "./ProductBackupCharger";
import ProductPhone from "./ProductPhone";
import ProductQuantity from "./ProductQuantity";
import productCable from "./ProductCable";

export default function ProductDetail({action, visible, onClose, product}) {
    const [productData, setProductData] = useState(product); // Data of product
    const [actionType, setActionType] = useState(action); // Action type of ProductDetail

    const [productQuantity, setProductQuantity] = useState([]); // List of product quantity
    const [productAdapter, setProductAdapter] = useState({}); // Product adapter
    const [productBackupCharger, setProductBackupCharger] = useState({}); // Product backup charger
    const [productPhone, setProductPhone] = useState({}); // Product phone
    const [productCable, setProductCable] = useState({}); // Product cable

    const [productQuantityVisible, setProductQuantityVisible] = useState(false); // Visible of ProductQuantity
    const [productPhoneVisible, setProductPhoneVisible] = useState(false); // Visible of ProductPhone
    const [actionOnProductParameter, setActionOnProductParameter] = useState(false); // Action of ProductParameter

    useEffect(() => {
        setProductData(product);
        console.log(product);

        if (actionType === "edit") {
            fetchProductQuantity();
            fetchProductBackupCharger();
            fetchProductAdapter();
            fetchProductPhone();
            fetchProductCable();
        } else {
            setProductQuantity([]);
            setProductAdapter({});
            setProductBackupCharger({});
            setProductPhone({});
            setProductCable({});
        }
    }, [product]);

    const fetchProductQuantity = async () => {
        try {
            const productQuantityResponse = await axios.get(`/ProductQuantity/ProductId=${productData.id}`);
            const productQuantityData = productQuantityResponse.data;
            setProductQuantity(productQuantityData);
        } catch (error) {
            console.log("Failed to fetch product quantity list: ", error.message);
        }
    };

    const fetchProductPhone = async () => {
        try {
            const productPhoneResponse = await axios.get(`/ParameterPhone/ProductId=${productData.id}`);
            const productPhoneData = productPhoneResponse.data;
            setProductPhone(productPhoneData);
        } catch (error) {
            console.log("Failed to fetch product phone list: ", error.message);
        }
    };

    const fetchProductAdapter = async () => {
        try {
            const productAdapterResponse = await axios.get(`/ParameterAdapter/ProductId=${productData.id}`);
            const productAdapterData = productAdapterResponse.data;
            setProductAdapter(productAdapterData);
        } catch (error) {
            console.log("Failed to fetch product adapter list: ", error.message);
        }
    };

    const fetchProductBackupCharger = async () => {
        try {
            const productBackupChargerResponse = await axios.get(`/ParameterBackupCharger/ProductId=${productData.id}`);
            const productBackupChargerData = productBackupChargerResponse.data;
            setProductBackupCharger(productBackupChargerData);
        } catch (error) {
            console.log("Failed to fetch product backup charger list: ", error.message);
        }
    };

    const fetchProductCable = async () => {
        try {
            const productCableResponse = await axios.get(`/ParameterCable/ProductId=${productData.id}`);
            const productCableData = productCableResponse.data;
            setProductCable(productCableData);
        } catch (error) {
            console.log("Failed to fetch product cable list: ", error.message);
        }
    };

    const handleOnChange = (e) => {
        const {id, value} = e.target;
        setProductData((prevData) => ({...prevData, [id]: value}));
    };

    const handleOnSave = () => {
        if (actionType === "add") {
            axios.post("Products", productData).then((response) => {
                if (response.status === 201) {
                    alert("Thêm sản phẩm thành công!");
                } else {
                    alert("Thêm sản phẩm thất bại!");
                }
            });
        } else if (actionType === "edit") {
            axios.put(`Products/${productData.id}`, productData).then((response) => {
                if (response.status === 204) {
                    alert("Sửa sản phẩm thành công!");
                } else {
                    alert("Sửa sản phẩm thất bại!");
                }
            });
        }
    }
    const onOpenNewQuantity = async () => {
        setActionOnProductParameter("add");
        const lastProductQuantityId = await axios.get("ProductQuantity/GetLastId").then((response) => {
                return response.data;
            }
        );
        const newId = lastProductQuantityId + 1;
        const newProductQuantity = {
            id: newId,
            productId: productData.id,
            color: "",
            quantity: 0
        }
        setProductQuantity([newProductQuantity]);
        setProductQuantityVisible(true);
    }

    const onCloseNewQuantity = () => {
        setProductQuantityVisible(false);
    }

    const onOpenEditQuantity = () => {
        setActionOnProductParameter("edit");
        setProductQuantity(productQuantity);
        setProductQuantityVisible(true);
    }

    const onCloseQuantity = () => {
        setProductQuantityVisible(false);
    }

    const onOpenEditPhone = () => {
        setActionType("edit");
        setProductPhoneVisible(true);
    }

    const onClosePhone = () => {
        setProductPhoneVisible(false);
    }

    if (!visible) {
        return null;
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Chi tiết sản phẩm</div>
                    <button onClick={onClose}>X</button>
                </div>
                <div className="content">
                    <table className="col-span-3">
                        <td>
                            <form className="form overflow-auto">
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="mr-2" htmlFor="id">ID</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md disabled:bg-slate-200"
                                           id="id"
                                           onChange={(e) => handleOnChange(e)}
                                           disabled
                                           value={productData.id}/>
                                </div>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="name">Tên sản phẩm</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md"
                                           id="name"
                                           onChange={(e) => handleOnChange(e)}
                                           value={productData.name}/>
                                </div>
                                <div className="form-group flex justify-between  mb-4">
                                    <label className="mr-2" htmlFor="price">Giá sản phẩm</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md"
                                           id="price"
                                           onChange={(e) => handleOnChange(e)}
                                           value={productData.price}/>
                                </div>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="description">Mô tả</label>
                                    <input
                                        type="text"
                                        className="form-control border border-black rounded-md"
                                        id="description"
                                        onChange={(e) => handleOnChange(e)}
                                        value={productData.description}/>
                                </div>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="category">Danh mục</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md"
                                           id="category"
                                           onChange={(e) => handleOnChange(e)}
                                           value={productData.category}/>
                                </div>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="brand">Thương hiệu</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md"
                                           id="brand"
                                           onChange={(e) => handleOnChange(e)}
                                           value={productData.brand}/>
                                </div>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="PreDiscount">Giá trước khi giảm giá</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md"
                                           id="PreDiscount"
                                           onChange={(e) => handleOnChange(e)}
                                           value={productData.PreDiscount}/>
                                </div>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="discountPercent">Phần trăm giảm giá</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md"
                                           id="discountPercent"
                                           onChange={(e) => handleOnChange(e)}
                                           value={productData.discountPercent}/>
                                </div>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="color">Màu sắc</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md"
                                           id="color"
                                           onChange={(e) => handleOnChange(e)}
                                           value={productData.color}/>
                                </div>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="image">Hình ảnh</label>
                                    {productData.image &&
                                        <img className={"w-32 h-32"}
                                             src={`data:image/jpeg;base64, ${productData.image}`}
                                             alt={productData.name}/>
                                    }
                                </div>
                                <div className="form-group flex justify-end mb-4">
                                    <input type="file" className="form-control" id="image"/>
                                </div>

                                <div className="form-group flex justify-end">
                                    <button type="button"
                                            className="btn btn-primary border border-green-500 bg-green-500 rounded-md p-2"
                                            onClick={() => handleOnSave()}>Lưu
                                    </button>
                                </div>
                            </form>
                        </td>
                        <td>
                            <div className="ml-6 flex flex-col items-center">
                                <tr>
                                    <button className="border border-black p-3 rounded-lg bg-blue-200"
                                            onClick={onOpenNewQuantity}
                                    >
                                        Thêm số lượng sản phẩm
                                    </button>
                                </tr>
                                <tr className="mt-5">
                                    <button className="border border-black p-3 rounded-lg bg-blue-200">
                                        Thêm thông số điện thoại
                                    </button>
                                </tr>
                                <tr className="mt-5">
                                    <button className="border border-black p-3 rounded-lg bg-blue-200 ">
                                        Thêm thông số sạc
                                    </button>
                                </tr>
                                <tr className="mt-5">
                                    <button className="border border-black p-3 rounded-lg bg-blue-200">
                                        Thêm thông số cáp
                                    </button>
                                </tr>
                                <tr className="mt-5">
                                    <button className="border border-black p-3 rounded-lg bg-blue-200">
                                        Thêm thông số sạc dự phòng
                                    </button>
                                </tr>
                            </div>
                        </td>
                        {actionType === "edit" && (
                            <td>
                                <div className="ml-6 flex flex-col items-center">
                                    {productQuantity.length > 0 && (
                                        <tr className="mt-5">
                                            <button
                                                className="border border-black p-3 rounded-lg bg-blue-200"
                                                onClick={onOpenEditQuantity}
                                            >
                                                Sửa số lượng sản phẩm
                                            </button>
                                        </tr>
                                    )}

                                    {productPhone.length > 0 && (
                                        <tr className="mt-5">
                                            <button className="border border-black p-3 rounded-lg bg-blue-200"
                                                    onClick={onOpenEditPhone}
                                            >
                                                Sửa thông số điện thoại
                                            </button>
                                        </tr>
                                    )}

                                    {productAdapter.length > 0 && (
                                        <tr className="mt-5">
                                            <button className="border border-black p-3 rounded-lg bg-blue-200 ">
                                                Sửa thông số sạc
                                            </button>
                                        </tr>
                                    )}

                                    {productCable.length > 0 && (
                                        <tr className="mt-5">
                                            <button className="border border-black p-3 rounded-lg bg-blue-200">
                                                Sửa thông số cáp
                                            </button>
                                        </tr>
                                    )}

                                    {productBackupCharger.length > 0 && (
                                        <tr className="mt-5">
                                            <button className="border border-black p-3 rounded-lg bg-blue-200">
                                                Sửa thông số sạc dự phòng
                                            </button>
                                        </tr>
                                    )}

                                </div>
                            </td>
                        )}
                    </table>
                </div>
            </div>

            {/*<productAdapter/>*/}
            {/*<productBackupCharger/>*/}
            {/*<ProductPhone visible={productPhoneVisible} data={productPhone} onClose={onClosePhone}/>*/}
            {/*<ProductQuantity visible={productQuantityVisible} data={productQuantity} onClose={onCloseQuantity} action={actionOnProductParameter}/>*/}
            {/*<productCable/>*/}
            <ProductPhone visible={productPhoneVisible} onClose={onOpenEditPhone} data={productData}
                          action={actionType}/>

        </div>
    )
}