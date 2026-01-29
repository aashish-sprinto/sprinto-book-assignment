import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        bookId: {
            type: Number,
            required: true,
            ref: "Book",
        },
        authorId: {
            type: Number,
            ref: "Author",
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        reviewerName: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
