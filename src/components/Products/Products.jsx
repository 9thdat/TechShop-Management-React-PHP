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
        sortValue: "name",
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
        localStorage.setItem("menu", "products");
    }, []);

    useEffect(() => {
        fetchProducts().then((res) => {
            setProducts(res);
            setOriginalProducts(res);
        });
    }, []);

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
            const response = await axios.put(`ProductQuantity/productId=${product.id}&quantity=${0}`);
            if (response.status === 204) {
                alert("Xóa sản phẩm thành công!");
            } else {
                alert("Xóa sản phẩm thất bại!");
            }
        } catch {
            console.log("productQuantity not found")
        }

        const newProducts = products.filter((product) => product.id !== product.id);
        setProducts(newProducts);
        setVisibleDelete(false);
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
        <div className="relative h-[90vh] overflow-x-scroll overflow-y-scroll shadow-md sm:rounded-lg">
            <div className="search top-0 right-0 flex items-center justify-end sticky h-[10vh] p-4 backdrop-blur-sm">
                <button
                    className="px-2 py-1 text-white bg-green-500 rounded-md"
                    onClick={AddProduct}
                >
                    Thêm
                </button>
                <input
                    type="text"
                    id="searchValue"
                    className="px-2 py-1 ml-2 rounded-md border border-black w-20 sm:w-60 md:w-80 lg:w-[66%]"
                    placeholder="Tìm kiếm sản phẩm"
                    value={search.searchValue}
                    onChange={(e) => handleOnChangeSearchType(e)}
                />
                <select
                    className="px-2 py-1 ml-2 rounded-md border border-black w-20 sm:w-24 md:w-28 lg:w-32"
                    id="sortValue"
                    onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="id">ID</option>
                    <option value="name">Tên</option>
                    <option value="brand">Hãng</option>
                </select>
                <select
                    className="px-2 py-1 ml-2 rounded-md border border-black w-24 sm:w-32 md:w-40 lg:w-48"
                    id="statusValue"
                    onChange={(e) => handleOnChangeSearchType(e)}
                >
                    <option value="all">Tất cả</option>
                    <option value="Stocking">Còn hàng</option>
                    <option value="OutOfStock">Hết hàng</option>
                </select>

                <button className={"px-2 py-1 ml-2 text-white bg-blue-500 rounded-md"}
                        onClick={handleOnSearch}
                >
                    Tìm kiếm
                </button>
            </div>
            <div className="overflow-scroll">
                <table className="w-full overflow-scroll text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tên
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Giá
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Loại
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Hãng
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Số lượng
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Hành động
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        products.map((product) => (
                            <tr key={product.id} className="odd:bg-white even:bg-gray-50 border-b dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {product.id}
                                </th>
                                <td className="px-6 py-4">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4">
                                    {product.price}
                                </td>
                                <td className="px-6 py-4 ">
                                    {product.category}
                                </td>
                                <td className="px-6 py-4">
                                    {product.brand}
                                </td>
                                <td className="px-6 py-4">
                                    {product.quantity}
                                </td>
                                <td className="px-6 py-4 flex items-center">
                                    <button className="px-2 py-1 text-white bg-blue-500 rounded-md"
                                            value={product.id}
                                            onClick={(e) => EditProduct(e)}>Sửa
                                    </button>
                                    <button className="px-2 py-1 ml-2 text-white bg-red-500 rounded-md"
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
                               product={product} onReload={fetchProducts}/>
            }

            {
                visibleDelete &&
                <ConfirmDelete visible={visibleDelete} onDelete={handleOnDelete} onAbortDelete={handleOnAbortDelete}/>
            }
        </div>
    );
}
