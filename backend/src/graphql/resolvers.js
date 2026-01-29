import { Author, Book, User } from "../models/index.js";
import Review from "../models/Review.js";
import BookMetadata from "../models/BookMetadata.js";
import { Op } from "sequelize";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { requireAuth, requireRole, canManageBook } from "../middleware/auth.js";

export const resolvers = {
    Query: {
        healthCheck: () => "🚀 Backend is up and running!",


        authors: async (_, { page = 1, limit = 10, filter = {} }) => {
            const offset = (page - 1) * limit;
            const where = {};

            if (filter.name) {
                where.name = { [Op.iLike]: `%${filter.name}%` };
            }

            if (filter.born_year) {
                where.born_date = {
                    [Op.gte]: new Date(`${filter.born_year}-01-01`),
                    [Op.lt]: new Date(`${filter.born_year + 1}-01-01`),
                };
            }

            const { count, rows } = await Author.findAndCountAll({
                where,
                limit,
                offset,
                order: [["createdAt", "DESC"]],
            });

            return {
                authors: rows,
                total: count,
                page,
                limit,
            };
        },

        author: async (_, { id }) => {
            return await Author.findByPk(id);
        },


        books: async (_, { page = 1, limit = 10, filter = {} }) => {
            const offset = (page - 1) * limit;
            const where = {};

            if (filter.title) {
                where.title = { [Op.iLike]: `%${filter.title}%` };
            }

            if (filter.author_id) {
                where.author_id = filter.author_id;
            }

            if (filter.published_date_from || filter.published_date_to) {
                where.published_date = {};
                if (filter.published_date_from) {
                    where.published_date[Op.gte] = new Date(filter.published_date_from);
                }
                if (filter.published_date_to) {
                    where.published_date[Op.lte] = new Date(filter.published_date_to);
                }
            }

            const { count, rows } = await Book.findAndCountAll({
                where,
                limit,
                offset,
                order: [["createdAt", "DESC"]],
                include: [{ model: Author, as: "author" }],
            });

            return {
                books: rows,
                total: count,
                page,
                limit,
            };
        },

        book: async (_, { id }) => {

            await BookMetadata.findOneAndUpdate(
                { bookId: id },
                { $inc: { viewCount: 1 } },
                { upsert: true }
            );

            return await Book.findByPk(id, {
                include: [{ model: Author, as: "author" }],
            });
        },


        reviews: async (_, { bookId, authorId }) => {
            const filter = {};
            if (bookId) filter.bookId = bookId;
            if (authorId) filter.authorId = authorId;

            return await Review.find(filter).sort({ createdAt: -1 });
        },
    },

    Mutation: {
        signup: async (_, { input }) => {
            const { email, password, name } = input;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error("Email already registered");
            }

            const author = await Author.create({ name });
            const user = await User.create({
                email,
                password,
                name,
                role: "AUTHOR",
                author_id: author.id,
            });

            const accessToken = generateAccessToken(user.id, user.email, user.role, author.id);
            const refreshToken = generateRefreshToken(user.id);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            };
        },

        login: async (_, { input }) => {
            const { email, password } = input;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new Error("Invalid email or password");
            }

            const isValid = await user.verifyPassword(password);
            if (!isValid) {
                throw new Error("Invalid email or password");
            }

            const accessToken = generateAccessToken(user.id, user.email, user.role, user.author_id);
            const refreshToken = generateRefreshToken(user.id);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            };
        },

        refreshToken: async (_, { refreshToken }) => {
            const payload = verifyRefreshToken(refreshToken);
            if (!payload) {
                throw new Error("Invalid or expired refresh token");
            }

            const user = await User.findByPk(payload.userId);
            if (!user) {
                throw new Error("User not found");
            }

            const newAccessToken = generateAccessToken(user.id, user.email, user.role, user.author_id);
            const newRefreshToken = generateRefreshToken(user.id);

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        },

        createAuthor: async (_, { input }, { user }) => {
            requireRole(user, ["ADMIN"]);
            return await Author.create(input);
        },

        updateAuthor: async (_, { id, input }, { user }) => {
            requireRole(user, ["ADMIN"]);
            const author = await Author.findByPk(id);
            if (!author) {
                throw new Error("Author not found");
            }
            await author.update(input);
            return author;
        },

        deleteAuthor: async (_, { id }, { user }) => {
            requireRole(user, ["ADMIN"]);
            const author = await Author.findByPk(id);
            if (!author) {
                throw new Error("Author not found");
            }
            await author.destroy();
            return true;
        },


        createBook: async (_, { input }, { user }) => {
            requireRole(user, ["ADMIN", "AUTHOR"]);
            
            if (user.role === "AUTHOR" && input.author_id !== user.authorId) {
                throw new Error("Forbidden: You can only add books in your own name");
            }

            const book = await Book.create(input);

            await BookMetadata.create({
                bookId: book.id,
                averageRating: 0,
                totalReviews: 0,
                viewCount: 0,
            });

            return await Book.findByPk(book.id, {
                include: [{ model: Author, as: "author" }],
            });
        },

        updateBook: async (_, { id, input }, { user }) => {
            requireRole(user, ["ADMIN", "AUTHOR"]);
            const book = await Book.findByPk(id);
            if (!book) {
                throw new Error("Book not found");
            }
            
            canManageBook(user, book);
            
            await book.update(input);
            return await Book.findByPk(id, {
                include: [{ model: Author, as: "author" }],
            });
        },

        deleteBook: async (_, { id }, { user }) => {
            requireRole(user, ["ADMIN", "AUTHOR"]);
            const book = await Book.findByPk(id);
            if (!book) {
                throw new Error("Book not found");
            }

            canManageBook(user, book);

            await BookMetadata.deleteOne({ bookId: id });
            await Review.deleteMany({ bookId: id });

            await book.destroy();
            return true;
        },


        createReview: async (_, { input }, { user }) => {
            requireAuth(user);
            const review = await Review.create(input);

            const reviews = await Review.find({ bookId: input.bookId });
            const avgRating =
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

            await BookMetadata.findOneAndUpdate(
                { bookId: input.bookId },
                {
                    averageRating: avgRating,
                    totalReviews: reviews.length,
                },
                { upsert: true }
            );

            return review;
        },

        deleteReview: async (_, { id }, { user }) => {
            requireRole(user, ["ADMIN"]);
            const review = await Review.findByIdAndDelete(id);
            if (!review) {
                throw new Error("Review not found");
            }

            const reviews = await Review.find({ bookId: review.bookId });
            const avgRating =
                reviews.length > 0
                    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                    : 0;

            await BookMetadata.findOneAndUpdate(
                { bookId: review.bookId },
                {
                    averageRating: avgRating,
                    totalReviews: reviews.length,
                }
            );

            return true;
        },
    },


    Author: {
        books: async (author) => {
            return await Book.findAll({
                where: { author_id: author.id },
                order: [["createdAt", "DESC"]],
            });
        },
    },

    Book: {
        author: async (book) => {
            if (book.author) return book.author;
            return await Author.findByPk(book.author_id);
        },

        metadata: async (book) => {
            return await BookMetadata.findOne({ bookId: book.id });
        },

        reviews: async (book) => {
            return await Review.find({ bookId: book.id }).sort({ createdAt: -1 });
        },
    },
};
