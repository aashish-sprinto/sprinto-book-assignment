import mongoose from "mongoose";

const bookMetadataSchema = new mongoose.Schema(
    {
        bookId: {
            type: Number,
            required: true,
            unique: true,
            ref: "Book",
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
        tags: [String],
        genre: String,
        additionalInfo: {
            type: Map,
            of: String,
        },
    },
    {
        timestamps: true,
    }
);

const BookMetadata = mongoose.model("BookMetadata", bookMetadataSchema);

export default BookMetadata;
