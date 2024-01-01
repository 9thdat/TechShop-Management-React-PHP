import axios from '../../api/axios';

export const fetchReviews = async () => {
    try {
        const response = await axios.get("/Review/GetAllReviews.php");
        return response.data.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const UpdateReview = async (review) => {
    try {
        const response = await axios.put(`/Review/UpdateReview.php?id=${review.id}&content=${review.adminReply}`);
        return response.data;
    } catch (err) {
        console.log(err);
        return err;
    }
}