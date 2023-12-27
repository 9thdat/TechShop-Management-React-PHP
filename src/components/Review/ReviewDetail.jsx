import React, {useState, useEffect} from "react";

export default function ReviewDetail({visible, onClose, data, onSave}) {
    const [review, setReview] = useState({
        id: "",
        productId: "",
        customerEmail: "",
        rating: "",
        content: "",
        adminReply: ""
    });
    const [adminReply, setAdminReply] = useState(true);

    useEffect(() => {
        setReview(data);
    }, [data]);

    useEffect(() => {
        if (data.adminReply === null) {
            setAdminReply(false);
        }
    }, [data]);

    const handleOnChange = (e, index) => {
        const {id, value} = e.target;
        setReview(
            {
                ...review,
                [id]: value
            }
        );
    };

    const handleOnSave = () => {
        onSave(review);
    };

    if (!visible) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xs overflow-auto"
        >
            <div className="bg-white p-3 rounded-md">
                <div className="flex justify-between">
                    <div className="text-2xl">Thông tin đánh giá</div>
                    <button onClick={() => {
                        onClose();
                    }}>X
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div className="">
                        <label className="" htmlFor="id">ID</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                               id="id"
                               onChange={(e) => handleOnChange(e)}
                               value={review.id}
                               disabled={true}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor="productId">ID sản phẩm</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                               id="productId"
                               onChange={(e) => handleOnChange(e)}
                               value={review.productId}
                               disabled={true}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor="customerEmail">Email khách hàng</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                               id="customerEmail"
                               onChange={(e) => handleOnChange(e)}
                               value={review.customerEmail}
                               disabled={true}
                        />
                    </div>
                    <div className="">
                        <label className="" htmlFor="rating">Đánh giá</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300`}
                               id="rating"
                               onChange={(e) => handleOnChange(e)}
                               value={review.rating}
                               disabled={true}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="" htmlFor="content">Nội dung</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300 w-full`}
                               id="content"
                               onChange={(e) => handleOnChange(e)}
                               value={review.content}
                               disabled={true}
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="" htmlFor="adminReply">Admin phản hồi</label>
                        <input type="text"
                               className={`border border-black rounded-md text-center block disabled:bg-gray-300 w-full`}
                               id="adminReply"
                               onChange={(e) => handleOnChange(e)}
                               value={review.adminReply}
                               disabled={adminReply}
                        />
                    </div>
                    <div className="flex justify-end col-span-2">
                        {
                            !(data.adminReply) &&
                            <button
                                className="px-2 py-1 text-white bg-blue-500 rounded-md"
                                onClick={handleOnSave}
                            >
                                Lưu
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}