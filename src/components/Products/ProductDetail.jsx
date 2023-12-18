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

    const [actionOnProductParameter, setActionOnProductParameter] = useState(""); // Action of ProductParameter

    useEffect(() => {
        setProductData(product);
        console.log(product);

        if (actionType === "edit") {
            const fetchProductInfo = async () => {
                await fetchProductQuantity(productData.id).then((res) => {
                    setProductQuantity(res);
                });
                await fetchProductBackupCharger(productData.id).then((res) => {
                    setProductBackupCharger(res);
                });
                await fetchProductAdapter(productData.id).then((res) => {
                    setProductAdapter(res);
                });
                await fetchProductPhone(productData.id).then((res) => {
                    setProductPhone(res);
                });
                await fetchProductCable(productData.id).then((res) => {
                    setProductCable(res);
                });
            }

            fetchProductInfo();
        } else {
            setProductQuantity([]);
            setProductAdapter({});
            setProductBackupCharger({});
            setProductPhone({});
            setProductCable({});
        }
    }, [product]);

    const fetchProductQuantity = async (productId) => {
        try {
            const productQuantityResponse = await axios.get(`/ProductQuantity/ProductId=${productId}`);
            return productQuantityResponse.data;
        } catch (error) {
            console.log("Failed to fetch product quantity list: ", error.message);
            return [];
        }
    };

    const fetchProductPhone = async (productId) => {
        try {
            const productPhoneResponse = await axios.get(`/ParameterPhone/ProductId=${productId}`);
            return productPhoneResponse.data;
        } catch (error) {
            console.log("Failed to fetch product phone list: ", error.message);
            return {};
        }
    };

    const fetchProductAdapter = async (productId) => {
        try {
            const productAdapterResponse = await axios.get(`/ParameterAdapter/ProductId=${productId}`);
            return productAdapterResponse.data;
        } catch (error) {
            console.log("Failed to fetch product adapter list: ", error.message);
            return {};
        }
    };

    const fetchProductBackupCharger = async (productId) => {
        try {
            const productBackupChargerResponse = await axios.get(`/ParameterBackupCharger/ProductId=${productId}`);
            return productBackupChargerResponse.data;
        } catch (error) {
            console.log("Failed to fetch product backup charger list: ", error.message);
            return {};
        }
    };

    const fetchProductCable = async (productId) => {
        try {
            const productCableResponse = await axios.get(`/ParameterCable/ProductId=${productId}`);
            return productCableResponse.data;
        } catch (error) {
            console.log("Failed to fetch product cable list: ", error.message);
            return {};
        }
    };

    const handleOnChange = (e) => {
        const {id, value} = e.target;
        setProductData((prevData) => ({...prevData, [id]: value}));
    };

    const handleUploadImage = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                const imageDataUrl = reader.result;

                // Tách chuỗi bằng dấu phẩy
                const parts = imageDataUrl.split(",");

                // Lấy phần sau của dấu phẩy (index 1 trong mảng)
                const base64String = parts[1];

                setProductData({
                    ...productData,
                    image: base64String,
                });
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };


    const handleOnDeleteImage = (e) => {
        setProductData({
            ...productData,
            image: null,
        });
    }

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
                        <tbody>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4 ">
                                    <label className="mr-2" htmlFor="id">ID</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md disabled:bg-slate-200"
                                           id="id"
                                           onChange={(e) => handleOnChange(e)}
                                           disabled
                                           value={productData.id}/>
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="name">Tên sản phẩm</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md"
                                           id="name"
                                           onChange={(e) => handleOnChange(e)}
                                           value={productData.name}/>
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between  mb-4">
                                    <label className="mr-2" htmlFor="price">Giá sản phẩm</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md"
                                           id="price"
                                           onChange={(e) => handleOnChange(e)}
                                           value={productData.price}/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="PreDiscount">Giá trước khi giảm giá</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md"
                                           id="PreDiscount"
                                           onChange={(e) => handleOnChange(e)}
                                           value={productData.preDiscount}/>
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="discountPercent">Phần trăm giảm giá</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md"
                                           id="discountPercent"
                                           onChange={(e) => handleOnChange(e)}
                                           value={productData.discountPercent}/>
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="brand">Thương hiệu</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md"
                                           id="brand"
                                           onChange={(e) => handleOnChange(e)}
                                           value={productData.brand}/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="category">Danh mục</label>
                                    <input type="text"
                                           className="form-control border border-black rounded-md"
                                           id="category"
                                           onChange={(e) => handleOnChange(e)}
                                           value={productData.category}/>
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="description">Mô tả</label>
                                    <textarea
                                        className="form-control border border-black rounded-md"
                                        id="description"
                                        onChange={(e) => handleOnChange(e)}
                                        value={productData.description}/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="form-group flex justify-between mb-4">
                                    <label className="mr-2" htmlFor="image">Hình ảnh</label>
                                    {
                                        productData.image &&
                                        <img className={"w-32 h-32"}
                                             src={`data:image/jpeg;base64, ${productData.image}`}
                                             alt={productData.name}/>
                                    }
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-end mb-4">
                                    <input
                                        type="file"
                                        className="form-control" id="image"
                                        onChange={(e) => handleUploadImage(e)}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="form-group flex justify-between mb-4">
                                    <button
                                        className="border border-black p-3 rounded-lg bg-red-500"
                                        onClick={(e) => handleOnDeleteImage(e)}
                                    >
                                        Xoá hình ảnh
                                    </button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <table className="col-span-5 flex items-center justify-evenly">
                        <tbody>
                        <tr>
                            {
                                (productQuantity.length <= 0) ? (
                                        <td className={""}>
                                            <div className="">
                                                <button className="border border-black p-3 rounded-lg bg-blue-200 text-xs"
                                                        onClick={onOpenNewQuantity}
                                                >
                                                    Thêm số lượng sản phẩm
                                                </button>
                                            </div>
                                        </td>
                                    )
                                    :
                                    (
                                        <td>
                                            <div className="ml-6 flex flex-col items-center">
                                                <div className="">
                                                    <button
                                                        className="border border-black p-3 rounded-lg bg-yellow-100 text-xs"
                                                        onClick={onOpenEditQuantity}
                                                    >
                                                        Sửa số lượng sản phẩm
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    )
                            }

                            {
                                (Object.keys(productPhone).length === 0) ?
                                    (
                                        <td>
                                            <div className="">
                                                <button
                                                    className="border border-black p-3 rounded-lg bg-blue-200 text-xs">
                                                    Thêm thông số điện thoại
                                                </button>
                                            </div>
                                        </td>
                                    )
                                    :
                                    (
                                        <td>
                                            <div className="">
                                                <div className="mt-5">
                                                    <button
                                                        className="border border-black p-3 rounded-lg bg-yellow-100 text-xs"
                                                        onClick={onOpenEditPhone}
                                                    >
                                                        Sửa thông số điện thoại
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    )
                            }
                            {
                                (Object.keys(productAdapter).length === 0) ?
                                    (
                                        <td>
                                            <div className="">
                                                <button
                                                    className="border border-black p-3 rounded-lg bg-blue-200 text-xs">
                                                    Thêm thông số sạc
                                                </button>
                                            </div>
                                        </td>
                                    )
                                    :
                                    (
                                        <td>
                                            <div className="">
                                                <div className="mt-5">
                                                    <button
                                                        className="border border-black p-3 rounded-lg bg-yellow-100 text-xs">
                                                        Sửa thông số sạc
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    )
                            }

                            {
                                (Object.keys(productCable).length === 0) ?
                                    (
                                        <td>
                                            <div className="">
                                                <button
                                                    className="border border-black p-3 rounded-lg bg-blue-200 text-xs">
                                                    Thêm thông số cáp
                                                </button>
                                            </div>
                                        </td>
                                    )
                                    :
                                    (
                                        <td>
                                            <div className="">
                                                <div className="mt-5">
                                                    <button
                                                        className="border border-black p-3 rounded-lg bg-yellow-100 text-xs">
                                                        Sửa thông số cáp
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    )
                            }
                            {
                                (Object.keys(productPhone).length === 0) ?
                                    (
                                        <td>
                                            <div className="">
                                                <button
                                                    className="border border-black p-3 rounded-lg bg-blue-200 text-xs">
                                                    Thêm thông số điện thoại
                                                </button>
                                            </div>
                                        </td>
                                    )
                                    :
                                    (
                                        <td>
                                            <div className="">
                                                <div className="mt-5">
                                                    <button
                                                        className="border border-black p-3 rounded-lg bg-yellow-100 text-xs">
                                                        Sửa thông số điện thoại
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    )
                            }
                        </tr>
                        </tbody>
                    </table>

                    <div className="form-group flex justify-end">
                        <button type="button"
                                className="btn btn-primary border border-green-500 bg-green-500 rounded-md p-2"
                                onClick={() => handleOnSave()}>Lưu
                        </button>
                    </div>

                </div>
            </div>

            {
                productQuantityVisible &&
                <ProductQuantity visible={productQuantityVisible} data={productQuantity} onClose={onCloseQuantity}
                                 action={actionOnProductParameter}/>
            }
            {/*<productAdapter/>*/}
            {/*<productBackupCharger/>*/}
            {/*<ProductPhone visible={productPhoneVisible} data={productPhone} onClose={onClosePhone}/>*/}

            {/*<productCable/>*/}
            {
                productPhoneVisible &&
                <ProductPhone visible={productPhoneVisible} onClose={onOpenEditPhone} data={productData}
                              action={actionType}/>
            }
        </div>
    )
}