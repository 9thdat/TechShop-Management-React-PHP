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
        if (data.adminReply === "") {
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
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center backdrop-blur-sm text-xl">
            <div className="bg-white p-4 rounded ">
                <div className="title flex justify-between px-1">
                    <div className="text-3xl">Thông tin đánh giá</div>
                    <button onClick={() => {
                        onClose();
                    }}>X
                    </button>
                </div>

                <div className="content">
                    <form className="form overflow-auto">
                        <table className="col-span-3">
                            <tr>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="id">ID</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="id"
                                               onChange={(e) => handleOnChange(e)}
                                               value={review.id}
                                               disabled={true}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="productId">ID sản phẩm</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="productId"
                                               onChange={(e) => handleOnChange(e)}
                                               value={review.productId}
                                               disabled={true}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="customerEmail">Email khách hàng</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="customerEmail"
                                               onChange={(e) => handleOnChange(e)}
                                               value={review.customerEmail}
                                               disabled={true}
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="rating">Đánh giá</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="rating"
                                               onChange={(e) => handleOnChange(e)}
                                               value={review.rating}
                                               disabled={true}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="content">Nội dung</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="content"
                                               onChange={(e) => handleOnChange(e)}
                                               value={review.content}
                                               disabled={true}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="form-group flex justify-between mb-4 ">
                                        <label className="mr-2" htmlFor="adminReply">Admin phản hồi</label>
                                        <input type="text"
                                               className="form-control border border-black rounded-md"
                                               id="adminReply"
                                               onChange={(e) => handleOnChange(e)}
                                               value={review.adminReply}
                                               disabled={adminReply}
                                        />
                                    </div>
                                </td>
                            </tr>

                        </table>
                    </form>
                </div>

                <div className="form-group flex justify-end">
                    {
                        !(data.adminReply) &&
                        <button
                            type="button"
                            className="btn btn-primary border border-green-500 bg-green-500 rounded-md p-2"
                            onClick={handleOnSave}
                        >
                            Lưu
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}