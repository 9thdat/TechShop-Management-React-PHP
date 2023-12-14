import React, {useEffect, useState} from "react";
import axios from "../../api/axios";
import ProductDetail from "./ProductDetail";
import ConfirmDelete from "./ConfirmDelete";

export default function Products() {
    const [products, setProducts] = useState([]); // List of products
    const [product, setProduct] = useState({}); // Data of product

    const [visibleProductDetail, setVisibleProductDetail] = useState(false); // Visible of ProductDetail
    const [visibleDelete, setVisibleDelete] = useState(false); // Visible of ConfirmDelete

    const [actionType, setActionType] = useState(""); // Action type of ProductDetail

    useEffect(() => {
        localStorage.setItem("menu", "products");
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [products]);

    const fetchProducts = async () => {
        try {
            const [productRespone, productQuantityResponse] = await Promise.all([
                axios.get("/Product"),
                axios.get("/ProductQuantity"),
            ]);

            const productData = productRespone.data;
            const productQuantityData = productQuantityResponse.data;

            const quantityMap = new Map(productQuantityData.map(item => [item.productId, item.quantity]));

            const updatedProductData = productData.map(product => ({
                ...product,
                quantity: (product.quantity || 0) + (quantityMap.get(product.id) || 0),
            }));

            setProducts(updatedProductData);
        } catch (error) {
            console.log("Failed to fetch product list: ", error.message);
        }
    };

    // Product
    const EditProduct = async (e) => {
        setActionType("edit");
        const product = products.find((product) => product.id === parseInt(e.target.value));
        setProduct(product);

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
            console.log(response);
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
    
    const AddProduct = (e) => {
        setActionType("add");
        const id = products[products.length - 1].id + 1;
        const product = {
            id: id,
            name: "",
            price: "",
            image: "",
            description: "",
            category: "",
            brand: "",
            PreDiscount: "",
            discountPercent: "",
            color: "",
        };
        setProduct(product);
        setVisibleProductDetail(true);
    }

    return (
        <div className="relative h-[90vh] overflow-x-scroll overflow-y-scroll shadow-md sm:rounded-lg">
            <div className="h-[10vh] top-0 right-0 p-4 sticky backdrop-blur-sm">
                <button className="px-2 py-1 text-white bg-green-500 rounded-md"
                        onClick={(e) => AddProduct(e)}>Thêm mới sản phẩm
                </button>

                <input type="text" className="px-2 py-1 ml-2 rounded-md border border-black w-4/5"
                       placeholder="Tìm kiếm sản phẩm"/>
                <button className="px-2 py-1 ml-2 text-white bg-blue-500 rounded-md">Tìm kiếm</button>
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
                            Mô tả
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
                            Phần trăm giảm giá
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Màu sắc
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
                                <td className="px-6 py-4">
                                    {product.description}
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
                                <td className="px-6 py-4">
                                    {product.discountPercent}
                                </td>
                                <td className="px-6 py-4">
                                    {product.color}
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

            <ProductDetail action={actionType} visible={visibleProductDetail} onClose={handleOnCloseProductDetail}
                           product={product}/>

            <ConfirmDelete visible={visibleDelete} onDelete={handleOnDelete} onAbortDelete={handleOnAbortDelete}/>
        </div>
    );
}
