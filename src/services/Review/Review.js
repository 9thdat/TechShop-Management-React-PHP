import axios from '../../api/axios';

export const fetchReviews = async () => {
    try {
        const response = await axios.get("/Review");
        return response.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const UpdateReview = async (review) => {
    try {
        const response = await axios.put(`/Review/Id=${review.id}&Content=${review.adminReply}`);
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}