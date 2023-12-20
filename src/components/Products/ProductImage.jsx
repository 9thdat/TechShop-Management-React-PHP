import React, {useState, useEffect} from "react";


export default function ProductImage({visible, onClose, data, action, onSave}) {
    const [productImage, setProductImage] = useState({});
    const [productImages, setProductImages] = useState([]);

    const [length, setLength] = useState(0);
    const [current, setCurrent] = useState(0);
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        if (data[0].new === true) {
            setProductImages([]);
            setLength(0);
        } else {
            setProductImages(data);
            setLength(data.length);
        }
    }, [data]);


    const handleOnChange = (e) => {
        const {id, value} = e.target;
        setProductImage(
            {
                ...productImage,
                [id]: (id === "ordinal") ? Number(value) : value,
            }
        );

        setProductImages((prevData) =>
            prevData.map((item, i) =>
                i === current - 1 ? {...item, [id]: (id === "ordinal") ? Number(value) : value} : item
            )
        );
    }

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

                setProductImage({
                    ...productImage,
                    image: base64String,
                });

                setProductImages((prevData) =>
                    prevData.map((item, i) =>
                        i === current - 1 ? {...item, image: base64String} : item
                    )
                );
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    const handleDisplayImage = (e) => {
        const {value} = e.target;
        if (value === "") {
            setProductImage({
                "id": "",
                "productId": data[0].productId,
                "color": data[0].color,
                "ordinal": "",
                "image": "",
            });
            setCurrent(0);
        } else {
            setCurrent(value);
            setProductImage(productImages[value - 1]);
        }
    }

    const handleAddProductImage = () => {
        setLength(length + 1);
        setCurrent(length + 1);
        setProductImage({
            "id": "",
            "productId": data[0].productId,
            "color": data[0].color,
            "ordinal": "",
            "image": "",
        });
        setProductImages((prevData) => [
            ...prevData,
            {
                "id": "",
                "productId": data[0].productId,
                "color": data[0].color,
                "ordinal": "",
                "image": "",
            },
        ]);
    }

    const handleOnDeleteImage = () => {
        setProductImages((prevData) =>
            prevData.filter((item, i) => i !== current - 1)
        );

        setLength((prevLength) => prevLength - 1);

        // Update productImage after the state has been updated
        setTimeout(() => {
            setProductImage(productImages[current - 2] || {});
            setCurrent((prevCurrent) => prevCurrent - 1);
        }, 0);
    };


    const handleOnSave = () => {
        onSave(productImages);
        onClose();
    }

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Thông tin hình ảnh</div>
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
                                <td>
                                    <label htmlFor={"stt"}>Hình ảnh thứ </label>
                                    <select
                                        className="form-control border border-black rounded-md disabled:bg-slate-200 mb-2 mr-2"
                                        id="stt"
                                        onChange={(e) => handleDisplayImage(e)}
                                        defaultValue={""}
                                        value={current}
                                    >
                                        <option value={""}></option>
                                        {
                                            length !== null &&
                                            Array.from(Array(length + 1).keys())
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
                                        onClick={handleAddProductImage}
                                    >
                                        Thêm một hình ảnh
                                    </button>
                                </td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="ordinal">Thứ tự</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="ordinal"
                                               onChange={(e) => handleOnChange(e)}
                                               value={productImage.ordinal}
                                               disabled={current === 0}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="image">Hình ảnh</label>
                                        {
                                            productImage.image &&
                                            <img className={"w-32 h-32"}
                                                 src={`data:image/jpeg;base64, ${productImage.image}`}
                                                 alt={productImage.color}/>
                                        }
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <input
                                            type="file"
                                            className="form-control" id="image"
                                            onChange={(e) => handleUploadImage(e)}
                                        />
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
                <div className="footer flex justify-between">
                    <button
                        type="button"
                        className="btn btn-primary border border-green-500 bg-red-400 rounded-md p-2"
                        onClick={handleOnDeleteImage}
                        disabled={current === 0}
                    >
                        Xóa sản phẩm
                    </button>
                    <button className="btn btn-primary border border-green-500 bg-green-400 rounded-md p-2"
                            onClick={handleOnSave}>Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}

