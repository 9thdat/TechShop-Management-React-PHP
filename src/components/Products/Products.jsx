import React, {useEffect, useState, useRef} from "react";
import axios from "../../api/axios";
import ProductDetail from "./ProductDetail";
import ConfirmDelete from "./ConfirmDelete";

export default function Products() {
    const [products, setProducts] = useState([]); // List of products
    const [product, setProduct] = useState({}); // Data of product

    const [visibleProductDetail, setVisibleProductDetail] = useState(false); // Visible of ProductDetail
    const [visibleDelete, setVisibleDelete] = useState(false); // Visible of ConfirmDelete

    const [actionType, setActionType] = useState(""); // Action type of ProductDetail

    const [originalProducts, setOriginalProducts] = useState([]);

    const search = useRef({
        searchValue: "",
        sortValue: "id",
        statusValue: "all",
    });

    const handleOnSearch = async () => {
        try {
            const searchValue = search.current.searchValue;
            const sortValue = search.current.sortValue;
            const statusValue = search.current.statusValue;

            let searchResult = originalProducts;

            // Apply search filter
            searchResult = searchResult.filter((product) => {
                if (statusValue === "all") {
                    if (sortValue === "id") {
                        return product[sortValue].toString().includes(searchValue);
                    } else {
                        return product[sortValue].toLowerCase().includes(searchValue.toLowerCase());
                    }
                } else {
                    if (sortValue === "id") {
                        return product[sortValue].toString().includes(searchValue) &&
                            (statusValue === "Stocking" ? product.quantity > 0 : product.quantity === 0);
                    }
                    return (
                        product[sortValue].toLowerCase().includes(searchValue.toLowerCase()) &&
                        (statusValue === "Stocking" ? product.quantity > 0 : product.quantity === 0)
                    );
                }
            });

            // Update the state with the filtered products
            setProducts(searchResult);
        } catch (error) {
            console.error("Error while searching:", error.message);
        }
    };


    const handleOnChangeSearchType = (e) => {
        const {id, value} = e.target;
        search.current = {
            ...search.current,
            [id]: value
        };
    }

    useEffect(() => {
        sessionStorage.setItem("menu", "products");
    }, []);

    useEffect(() => {
        fetchProducts().then((res) => {
            setProducts(res);
            setOriginalProducts(res);
        });
    }, []);

    const reloadProduct = async (productId, action) => {
        const res = await fetchProduct(productId);
        if (action === "edit") {
            const newProduct = products.map((product) => {
                    if (product.id === productId) {
                        return {
                            ...product,
                            name: res.name,
                            price: res.price,
                            image: res.image,
                            description: res.description,
                            category: res.category,
                            brand: res.brand,
                            PreDiscount: res.PreDiscount,
                            discountPercent: res.discountPercent,
                        };
                    }
                    return product;
                }
            );
            setProducts(newProduct);
            setOriginalProducts(
                originalProducts.map((product) => {
                        if (product.id === productId) {
                            return {
                                ...product,
                                name: res.name,
                                price: res.price,
                                image: res.image,
                                description: res.description,
                                category: res.category,
                                brand: res.brand,
                                PreDiscount: res.PreDiscount,
                                discountPercent: res.discountPercent,
                            };
                        }
                        return product;
                    }
                )
            );
        } else {
            const newProduct = products.map((product) => {
                    if (product.id === productId) {
                        return {
                            ...product,
                            quantity: res.quantity,
                        };
                    }
                    return product;
                }
            );
            setProducts(newProduct);
            setOriginalProducts(
                originalProducts.map((product) => {
                        if (product.id === productId) {
                            return {
                                ...product,
                                quantity: res.quantity,
                            };
                        }
                        return product;
                    }
                )
            );
        }
    }

    const fetchProduct = async (productId) => {
        try {
            const response = await axios.get(`/Product/${productId}`);
            return response.data;
        } catch (error) {
            console.log("Failed to fetch product: ", error.message);
            return {};
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get("/Product/GetProductAndQuantity");
            return response.data;
        } catch (error) {
            console.log("Failed to fetch product list: ", error.message);
            return [];
        }
    };

    // Product
    const EditProduct = async (e) => {
        const product = products.find((product) => product.id === parseInt(e.target.value));
        setProduct(product);
        setActionType("edit");

        // Set visible to ProductDetail
        setVisibleProductDetail(true);
    };

    const DeleteProduct = (e) => {
        setVisibleDelete(true);
        const product = products.find((product) => product.id === parseInt(e.target.value));
        setProduct(product);
    };

    const handleOnDelete = async () => {
        const product = products.find((product) => product.id === product.id);
        try {
            // Update productQuantity
            const response = await axios.put(`Product/DeleteProduct/${product.id}`);
            if (response.status === 204) {
                alert("Xóa sản phẩm thành công!");
                setVisibleDelete(false);
                const newProduct = products.map((product) => {
                        if (product.id === product.id) {
                            return {
                                ...product,
                                quantity: 0,
                            };
                        }
                        return product;
                    }
                );
                setProducts(newProduct);
                setOriginalProducts(
                    originalProducts.map((product) => {
                            if (product.id === product.id) {
                                return {
                                    ...product,
                                    quantity: 0,
                                };
                            }
                            return product;
                        }
                    )
                );
            } else {
                alert("Xóa sản phẩm thất bại!");
            }
        } catch {
            console.log("productQuantity not found")
        }
    }

    const handleOnAbortDelete = () => {
        setVisibleDelete(false);
    }

    // Product Detail
    const handleOnCloseProductDetail = () => {
        setVisibleProductDetail(false);
    }

    const AddProduct = async (e) => {
        setActionType("add");
        const id = await fetchLastProductId() + 1;
        const product = {
            id: id,
            name: "",
            price: "",
            image: "",
            description: "",
            category: "1",
            brand: "",
            PreDiscount: "",
            discountPercent: "",
        };
        setProduct(product);
        setVisibleProductDetail(true);
    }

    const fetchLastProductId = async () => {
        try {
            const response = await axios.get("/Product/GetLastId");
            return response.data;
        } catch (error) {
            console.log("Failed to fetch last product id: ", error.message);
            return "";
        }
    }

    return (
        <div className="">
            <div className="top-0 right-0 backdrop-blur-sm grid grid-cols-6 grid-rows-2">
                <button
                    className="col-start-1 col-end-3 row-start-1 row-end-2 border border-green-500 rounded-md bg-green-500 text-white"
                    onClick={AddProduct}
                >
                    Thêm mới
                </button>
                <input
                    type="text"
                    id="searchValue"
                    className="col-start-3 col-end-7 row-start-1 row-end-2 border border-blue-300 rounded-md"
                    placeholder="Tìm kiếm sản phẩm"
                    value={search.searchValue}
                    onChange={(e) => handleOnChangeSearchType(e)}
                />
                <select
                    className="col-start-1 col-end-3 row-start-2 row-end-3 border border-blue-300 rounded-md"
                    id="sortValue"
                    onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="id">ID</option>
                    <option value="name">Tên</option>
                    <option value="brand">Hãng</option>
                </select>
                <select
                    className="col-start-3 col-end-5 row-start-2 row-end-3 border border-blue-300 rounded-md"
                    id="statusValue"
                    onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="all">Tất cả</option>
                    <option value="Stocking">Còn hàng</option>
                    <option value="OutOfStock">Hết hàng</option>
                </select>

                <button
                    className="col-start-5 col-end-7 row-start-2 row-end-3 border border-blue-300 rounded-md bg-blue-400 text-white"
                    onClick={handleOnSearch}
                >
                    Tìm kiếm
                </button>
            </div>
            <div className="overflow-x-auto overflow-y-auto h-screen">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <tbody className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="text-center py-3">
                            ID
                        </th>
                        <th scope="col" className="text-center">
                            Tên
                        </th>
                        <th scope="col" className="text-center">
                            Giá
                        </th>
                        <th scope="col" className="text-center">
                            Loại
                        </th>
                        <th scope="col" className="text-center">
                            Hãng
                        </th>
                        <th scope="col" className="text-center">
                            Số lượng
                        </th>
                        <th scope="col" className="text-center">
                            Hành động
                        </th>
                    </tr>
                    </tbody>
                    <tbody className={"text-xs"}>
                    {
                        products.map((product) => (
                            <tr
                                key={product.id}
                                className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700"
                            >
                                <td
                                    scope="row"
                                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
                                >
                                    {product.id}
                                </td>
                                <td
                                    scope="row"
                                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis max-w-sm"
                                >
                                    {product.name}
                                </td>
                                <td
                                    scope="row"
                                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
                                >
                                    {product.price}
                                </td>
                                <td className="px-6 py-4 ">
                                    {product.category}
                                </td>
                                <td
                                    scope="row"
                                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
                                >
                                    {product.brand}
                                </td>
                                <td
                                    scope="row"
                                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
                                >
                                    {product.quantity}
                                </td>
                                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap flex gap-2">
                                    <button
                                        className="px-2 py-1 text-white bg-blue-400 rounded-md"
                                        value={product.id}
                                        onClick={(e) => EditProduct(e)}>Chi tiết
                                    </button>
                                    <button
                                        className="px-2 py-1 text-white bg-red-500 rounded-md"
                                        value={product.id}
                                        onClick={(e) => DeleteProduct(e)}>Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
            {
                visibleProductDetail &&
                <ProductDetail action={actionType} visible={visibleProductDetail} onClose={handleOnCloseProductDetail}
                               product={product} onReload={reloadProduct}/>
            }

            {
                visibleDelete &&
                <ConfirmDelete visible={visibleDelete} onDelete={handleOnDelete} onAbortDelete={handleOnAbortDelete}/>
            }
        </div>
    );
}
