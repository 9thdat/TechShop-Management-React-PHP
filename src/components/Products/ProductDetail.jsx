import React, {useState, useEffect} from "react";
import axios from "../../api/axios";
import productAdapter from "./ProductAdapter";
import productBackupCharger from "./ProductBackupCharger";
import ProductPhone from "./ProductPhone";
import ProductQuantity from "./ProductQuantity";
import productCable from "./ProductCable";
import ProductCable from "./ProductCable";
import ProductBackupCharger from "./ProductBackupCharger";
import ProductAdapter from "./ProductAdapter";

export default function ProductDetail({action, visible, onClose, product, onReload}) {
    const [productData, setProductData] = useState(product); // Data of product
    const [category, setCategory] = useState([]); // List of category
    const categoryNames = {
        1: "Điện thoại",
        2: "Sạc",
        3: "Cáp",
        4: "Sạc dự phòng",
    };
    const [actionType, setActionType] = useState(action); // Action type of ProductDetail

    const [productQuantity, setProductQuantity] = useState([]); // List of product quantity
    const [productAdapter, setProductAdapter] = useState({}); // Product adapter
    const [productBackupCharger, setProductBackupCharger] = useState({}); // Product backup charger
    const [productPhone, setProductPhone] = useState({}); // Product phone
    const [productCable, setProductCable] = useState({}); // Product cable
    const [productImage, setProductImage] = useState([]); // Product image

    const [productQuantityVisible, setProductQuantityVisible] = useState(false); // Visible of ProductQuantity
    const [productPhoneVisible, setProductPhoneVisible] = useState(false); // Visible of ProductPhone
    const [productAdapterVisible, setProductAdapterVisible] = useState(false); // Visible of ProductAdapter
    const [productBackupChargerVisible, setProductBackupChargerVisible] = useState(false); // Visible of ProductBackupCharger
    const [productCableVisible, setProductCableVisible] = useState(false); // Visible of ProductCable

    const [actionOnProductParameter, setActionOnProductParameter] = useState(""); // Action of ProductParameter

    useEffect(() => {
        setProductData(product);

        const fetchCategoryList = async () => {
            await fetchCategory().then((res) => {
                setCategory(res);
            });
        }

        fetchCategoryList();
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

    const fetchCategory = async () => {
        try {
            const categoryResponse = await axios.get("/Category");
            return categoryResponse.data.length > 0 ? categoryResponse.data : [];
        } catch (error) {
            console.log("Failed to fetch category list: ", error.message);
            return [];
        }
    };

    const fetchProductQuantity = async (productId) => {
        try {
            const productQuantityResponse = await axios.get(`/ProductQuantity/ProductId=${productId}`);
            return productQuantityResponse.data.length > 0 ? productQuantityResponse.data : [];
        } catch (error) {
            console.log("Failed to fetch product quantity list: ", error.message);
            return [];
        }
    };

    const fetchProductPhone = async (productId) => {
        try {
            const productPhoneResponse = await axios.get(`/ParameterPhone/ProductId=${productId}`);
            return productPhoneResponse.data.length > 0 ? productPhoneResponse.data[0] : {};
        } catch (error) {
            console.log("Failed to fetch product phone list: ", error.message);
            return {};
        }
    };

    const fetchProductAdapter = async (productId) => {
        try {
            const productAdapterResponse = await axios.get(`/ParameterAdapter/ProductId=${productId}`);
            return productAdapterResponse.data.length > 0 ? productAdapterResponse.data[0] : {};
        } catch (error) {
            console.log("Failed to fetch product adapter list: ", error.message);
            return {};
        }
    };

    const fetchProductBackupCharger = async (productId) => {
        try {
            const productBackupChargerResponse = await axios.get(`/ParameterBackupCharger/ProductId=${productId}`);
            return productBackupChargerResponse.data.length > 0 ? productBackupChargerResponse.data[0] : {};
        } catch (error) {
            console.log("Failed to fetch product backup charger list: ", error.message);
            return {};
        }
    };

    const fetchProductCable = async (productId) => {
        try {
            const productCableResponse = await axios.get(`/ParameterCable/ProductId=${productId}`);
            return productCableResponse.data.length > 0 ? productCableResponse.data[0] : {};
        } catch (error) {
            console.log("Failed to fetch product cable list: ", error.message);
            return {};
        }
    };

    const handleOnChange = (e) => {
        const {id, value} = e.target;
        setProductData(
            {
                ...productData,
                [id]: value
            }
        );
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

    const handleOnSave = async () => {
        if (actionType === "add") {
            let falseUpdate = [];
            try {
                const productUpdateResponse = await axios.post(`Product`, productData);
                if (productUpdateResponse.status === 204) {
                    if (productQuantity.length > 0) {
                        await Promise.all(
                            productQuantity.map(async (item) => {
                                try {
                                    const quantityCreateResponse = await axios.post(`ProductQuantity`, {
                                        productId: productData.id,
                                        color: item.color,
                                        quantity: item.quantity,
                                        sold: 0,
                                    });
                                    if (quantityCreateResponse.status !== 201) {
                                        falseUpdate.push(item);
                                    }
                                } catch (quantityError) {
                                    falseUpdate.push(item);
                                    console.error(quantityError);
                                }
                            }));
                    }

                    if (Object.keys(productCable).length > 0) {
                        try {
                            const productCableResponse = await axios.post(`ParameterCable`, {
                                ...productCable,
                                productId: productData.id,
                            });
                            if (productCableResponse.status !== 204) {
                                falseUpdate.push(productCable);
                            }
                        } catch (productCableError) {
                            falseUpdate.push(productCable);
                            console.error(productCableError);
                        }
                    }

                    if (Object.keys(productPhone).length > 0) {
                        try {
                            const productPhoneResponse = await axios.post(`ParameterPhone`, {
                                ...productPhone,
                                productId: productData.id,

                            });
                            if (productPhoneResponse.status !== 204) {
                                falseUpdate.push(productPhone);
                            }
                        } catch (productPhoneError) {
                            falseUpdate.push(productPhone);
                            console.error(productPhoneError);
                        }
                    }

                    if (Object.keys(productBackupCharger).length > 0) {
                        try {
                            const productBackupChargerResponse = await axios.post(`ParameterBackupCharger`, {
                                ...productBackupCharger,
                                productId: productData.id,
                            });
                            if (productBackupChargerResponse.status !== 204) {
                                falseUpdate.push(productBackupCharger);
                            }
                        } catch (productBackupChargerError) {
                            falseUpdate.push(productBackupCharger);
                            console.error(productBackupChargerError);
                        }
                    }

                    if (Object.keys(productAdapter).length > 0) {
                        try {
                            const productAdapterResponse = await axios.post(`ParameterAdapter`, {
                                ...productAdapter,
                                productId: productData.id,
                            });
                            if (productAdapterResponse.status !== 204) {
                                falseUpdate.push(productAdapter);
                            }
                        } catch (productAdapterError) {
                            falseUpdate.push(productAdapter);
                            console.error(productAdapterError);
                        }
                    }

                    if (Object.keys(productImage).length > 0) {
                        try {
                            productImage.map(async (item) => {
                                try {
                                    delete item.id;
                                    const productImageResponse = await axios.post(`ImageDetail`, item);
                                    if (productImageResponse.status !== 204) {
                                        falseUpdate.push(item);
                                    }
                                } catch (productImageError) {
                                    falseUpdate.push(item);
                                    console.error(productImageError);
                                }
                            });
                        } catch (e) {
                            falseUpdate.push(productImage);
                            console.error(e);
                        }
                    }

                } else {
                    alert("Thêm sản phẩm thất bại!");
                    return;
                }
            } catch (productUpdateError) {
                alert("Thêm sản phẩm thất bại!");
                console.error(productUpdateError);
            }

            if (falseUpdate.length > 0) {
                alert("Thêm sản phẩm thất bại! " + falseUpdate.join(", ").toString());
            } else {
                alert("Thêm sản phẩm thành công!");
                onReload();
                onClose();
            }
        } else if (actionType === "edit") {
            let falseUpdate = [];
            try {
                if (productData.image === null) {
                    productData.image = "";
                }
                const productUpdateResponse = await axios.put(`Product/${productData.id}`, productData);
                if (productUpdateResponse.status === 204) {
                    if (productQuantity.length > 0) {
                        await Promise.all(
                            productQuantity.map(async (item) => {
                                if (item.id) {
                                    if (item.isDeleted === true) {
                                        try {
                                            const quantityDeleteResponse = await axios.delete(`ProductQuantity/${item.id}`);
                                            if (quantityDeleteResponse.status !== 200) {
                                                falseUpdate.push(item);
                                            }
                                        } catch (quantityDeleteError) {
                                            falseUpdate.push(item);
                                            console.error(quantityDeleteError);
                                        }
                                    } else {
                                        try {
                                            const quantityUpdateResponse = await axios.put(`ProductQuantity/${item.id}`, item);
                                            if (quantityUpdateResponse.status !== 200) {
                                                falseUpdate.push(item);
                                            }
                                        } catch (quantityUpdateError) {
                                            falseUpdate.push(item);
                                            console.error(quantityUpdateError);
                                        }
                                    }
                                } else {
                                    try {
                                        const quantityCreateResponse = await axios.post(`ProductQuantity`, {
                                            productId: productData.id,
                                            color: item.color,
                                            quantity: item.quantity,
                                            sold: 0,
                                        });
                                        if (quantityCreateResponse.status !== 201) {
                                            falseUpdate.push(item);
                                        }
                                    } catch (quantityCreateError) {
                                        falseUpdate.push(item);
                                        console.error(quantityCreateError);
                                    }
                                }
                            })
                        );
                    }


                    if (Object.keys(productCable).length > 0) {
                        if (productCable.id) {
                            try {
                                const productCableResponse = await axios.put(`ParameterCable/${productCable.id}`, productCable);
                                if (productCableResponse.status !== 204) {
                                    falseUpdate.push(productCable);
                                }
                            } catch (productCableError) {
                                falseUpdate.push(productCable);
                                console.error(productCableError);
                            }
                        } else {
                            try {
                                const productCableResponse = await axios.post(`ParameterCable`, {
                                    ...productCable,
                                    productId: productData.id,
                                });
                                if (productCableResponse.status !== 204) {
                                    falseUpdate.push(productCable);
                                }
                            } catch (productCableError) {
                                falseUpdate.push(productCable);
                                console.error(productCableError);
                            }
                        }
                    }

                    if (Object.keys(productPhone).length > 0) {
                        if (productPhone.id) {
                            try {
                                const productPhoneResponse = await axios.put(`ParameterPhone/${productPhone.id}`, productPhone);
                                if (productPhoneResponse.status !== 204) {
                                    falseUpdate.push(productPhone);
                                }
                            } catch (productPhoneError) {
                                falseUpdate.push(productPhone);
                                console.error(productPhoneError);
                            }
                        } else {
                            try {
                                const productPhoneResponse = await axios.post(`ParameterPhone`, {
                                    ...productPhone,
                                    productId: productData.id,
                                });
                                if (productPhoneResponse.status !== 204) {
                                    falseUpdate.push(productPhone);
                                }
                            } catch (productPhoneError) {
                                falseUpdate.push(productPhone);
                                console.error(productPhoneError);
                            }
                        }
                    }

                    if (Object.keys(productBackupCharger).length > 0) {
                        if (productBackupCharger.id) {
                            try {
                                const productBackupChargerResponse = await axios.put(`ParameterBackupCharger/${productBackupCharger.id}`, productBackupCharger);
                                if (productBackupChargerResponse.status !== 204) {
                                    falseUpdate.push(productBackupCharger);
                                }
                            } catch (productBackupChargerError) {
                                falseUpdate.push(productBackupCharger);
                                console.error(productBackupChargerError);
                            }
                        } else {
                            try {
                                const productBackupChargerResponse = await axios.post(`ParameterBackupCharger`, {
                                    ...productBackupCharger,
                                    productId: productData.id,
                                });
                                if (productBackupChargerResponse.status !== 204) {
                                    falseUpdate.push(productBackupCharger);
                                }
                            } catch (productBackupChargerError) {
                                falseUpdate.push(productBackupCharger);
                                console.error(productBackupChargerError);
                            }
                        }
                    }

                    if (Object.keys(productAdapter).length > 0) {
                        if (productAdapter.id) {
                            try {
                                const productAdapterResponse = await axios.put(`ParameterAdapter/${productAdapter.id}`, productAdapter);
                                if (productAdapterResponse.status !== 204) {
                                    falseUpdate.push(productAdapter);
                                }
                            } catch (productAdapterError) {
                                falseUpdate.push(productAdapter);
                                console.error(productAdapterError);
                            }
                        } else {
                            try {
                                const productAdapterResponse = await axios.post(`ParameterAdapter`, {
                                    ...productAdapter,
                                    productId: productData.id,
                                });
                                if (productAdapterResponse.status !== 204) {
                                    falseUpdate.push(productAdapter);
                                }
                            } catch (productAdapterError) {
                                falseUpdate.push(productAdapter);
                                console.error(productAdapterError);
                            }
                        }
                    }

                    if (Object.keys(productImage).length > 0) {
                        productImage.map(async (item) => {
                            if (item.id) {
                                if (item.isDeleted === true) {
                                    try {
                                        const productImageResponse = await axios.delete(`ImageDetail/${item.id}`);
                                        if (productImageResponse.status !== 200) {
                                            falseUpdate.push(item);
                                        }
                                    } catch (productImageError) {
                                        falseUpdate.push(item);
                                        console.error(productImageError);
                                    }
                                } else {
                                    try {
                                        const productImageResponse = await axios.put(`ImageDetail/${item.id}`, item);
                                        if (productImageResponse.status !== 204) {
                                            falseUpdate.push(item);
                                        }
                                    } catch (productImageError) {
                                        falseUpdate.push(item);
                                        console.error(productImageError);
                                    }
                                }
                            } else {
                                try {
                                    delete item.id;
                                    const productImageResponse = await axios.post(`ImageDetail`, item);
                                    if (productImageResponse.status !== 204) {
                                        falseUpdate.push(item);
                                    }
                                } catch (productImageError) {
                                    falseUpdate.push(item);
                                    console.error(productImageError);
                                }
                            }
                        });
                    }
                } else {
                    alert("Sửa sản phẩm thất bại!");
                }
            } catch (productUpdateError) {
                alert("Sửa sản phẩm thất bại!");
                console.error(productUpdateError);
            }

            if (falseUpdate.length > 0) {
                alert("Sửa sản phẩm thất bại! " + falseUpdate.join(", ").toString());
            } else {
                alert("Sửa sản phẩm thành công!");
                onReload(productData.id);
                onClose();
            }
        }
    };

    const onOpenNewQuantity = async () => {
        setActionOnProductParameter("add");
        setProductQuantityVisible(true);
    }

    const onOpenEditQuantity = () => {
        setActionOnProductParameter("edit");
        setProductQuantity(productQuantity);
        console.log(productQuantity);
        setProductQuantityVisible(true);
    }

    const handleOnSaveProductQuantity = (productQuantityData, productImageData) => {
        setProductQuantity(productQuantityData);
        setProductImage(productImageData);
    }

    useEffect(() => {
        console.log(productImage);
    }, [productImage]);

    const onCloseQuantity = () => {
        setProductQuantityVisible(false);
    }

    const onOpenNewPhone = () => {
        setProductPhone(
            {
                new: true,
            }
        )
        setActionOnProductParameter("add");
        setProductPhoneVisible(true);
    }

    const onOpenEditPhone = () => {
        setActionOnProductParameter("edit");
        setProductPhoneVisible(true);
    }

    const handleOnSaveProductPhone = (productPhoneData) => {
        setProductPhone(productPhoneData);
    }

    const onOpenNewCable = () => {
        setProductCable(
            {
                new: true,
            }
        )
        setActionOnProductParameter("add");
        setProductCableVisible(true);
    }

    const onOpenEditCable = () => {
        setActionOnProductParameter("edit");
        setProductCable(productCable);
        setProductCableVisible(true);
    }
    const onCloseCable = () => {
        setProductCableVisible(false);
    }

    const handleOnSaveProductCable = (productCableData) => {
        setProductCable(productCableData);
    }

    const onClosePhone = () => {
        setProductPhoneVisible(false);
    }

    const onOpenNewBackupCharger = () => {
        setProductBackupCharger(
            {
                new: true,
            }
        )
        setActionOnProductParameter("add");
        setProductBackupChargerVisible(true);
    }

    const openEditBackupCharger = () => {
        setActionOnProductParameter("edit");
        setProductBackupChargerVisible(true);
    }

    const onCloseBackupCharger = () => {
        setProductBackupChargerVisible(false);
    }

    const handleOnSaveProductBackupCharger = (productBackupChargerData) => {
        setProductBackupCharger(productBackupChargerData);
    }

    const onOpenNewAdapter = () => {
        setActionOnProductParameter("add");
        setProductAdapterVisible(true);
    }

    const openEditAdapter = () => {
        setActionOnProductParameter("edit");
        setProductAdapterVisible(true);
    }

    const onCloseAdapter = () => {
        setProductAdapterVisible(false);
    }

    const handleOnSaveProductAdapter = (productAdapterData) => {
        setProductAdapter(productAdapterData);
    }

    const handleReloadProductCable = () => {
        fetchProductCable(productData.id).then((res) => {
            setProductCable(res);
        });
    }

    const handleReloadProductBackupCharger = () => {
        fetchProductBackupCharger(productData.id).then((res) => {
            setProductBackupCharger(res);
        });
    }

    const handleReloadProductAdapter = () => {
        fetchProductAdapter(productData.id).then((res) => {
            setProductAdapter(res);
        });
    }

    const handleReloadProductPhone = () => {
        fetchProductPhone(productData.id).then((res) => {
            setProductPhone(res);
        });
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
                                    <select
                                        className="form-control border border-black rounded-md"
                                        id="category"
                                        onChange={(e) => handleOnChange(e)}
                                        value={productData.category}
                                    >
                                        {
                                            category.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {categoryNames[item.id] || ""}
                                                </option>
                                            ))
                                        }
                                    </select>
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
                                                    className="border border-black p-3 rounded-lg bg-blue-200 text-xs"
                                                    onClick={onOpenNewPhone}
                                                >
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
                                                    className="border border-black p-3 rounded-lg bg-blue-200 text-xs"
                                                    onClick={onOpenNewAdapter}
                                                >
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
                                                        className="border border-black p-3 rounded-lg bg-yellow-100 text-xs"
                                                        onClick={openEditAdapter}
                                                    >
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
                                                    className="border border-black p-3 rounded-lg bg-blue-200 text-xs"
                                                    onClick={onOpenNewCable}
                                                >
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
                                                        className="border border-black p-3 rounded-lg bg-yellow-100 text-xs"
                                                        onClick={onOpenEditCable}
                                                    >
                                                        Sửa thông số cáp
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    )
                            }
                            {
                                (Object.keys(productBackupCharger).length === 0) ?
                                    (
                                        <td>
                                            <div className="">
                                                <button
                                                    className="border border-black p-3 rounded-lg bg-blue-200 text-xs"
                                                    onClick={onOpenNewBackupCharger}
                                                >
                                                    Thêm thông số sạc dự phòng
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
                                                        onClick={openEditBackupCharger}
                                                    >
                                                        Sửa thông số sạc dự phòng
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
                                 action={actionOnProductParameter} onSave={handleOnSaveProductQuantity}/>
            }


            {
                productAdapterVisible &&
                <ProductAdapter visible={productAdapterVisible} onClose={onCloseAdapter} data={productAdapter}
                                action={actionOnProductParameter} onSave={handleOnSaveProductAdapter}
                                onReload={handleReloadProductAdapter}/>
            }

            {
                productBackupChargerVisible &&
                <ProductBackupCharger visible={productBackupChargerVisible} onClose={onCloseBackupCharger}
                                      data={productBackupCharger}
                                      action={actionOnProductParameter} onSave={handleOnSaveProductBackupCharger}
                                      onReload={handleReloadProductBackupCharger}/>
            }

            {
                productCableVisible &&
                <ProductCable visible={productCableVisible} onClose={onCloseCable} data={productCable}
                              action={actionOnProductParameter} onSave={handleOnSaveProductCable}
                              onReload={handleReloadProductCable}/>

            }

            {
                productPhoneVisible &&
                <ProductPhone visible={productPhoneVisible} onClose={onClosePhone} data={productPhone}
                              action={actionOnProductParameter} onSave={handleOnSaveProductPhone}
                              onReload={handleReloadProductPhone}/>
            }
        </div>
    )
}