import { describe, it, expect, jest, beforeEach } from '@jest/globals';

const mockAuthor = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
};

const mockBook = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
};

const mockReview = {
    find: jest.fn(() => ({ sort: jest.fn().mockResolvedValue([]) })),
    deleteMany: jest.fn(),
};

const mockBookMetadata = {
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
};

jest.unstable_mockModule('../models/index.js', () => ({
    Author: mockAuthor,
    Book: mockBook,
    User: {},
}));

jest.unstable_mockModule('../models/Review.js', () => ({
    default: mockReview,
}));

jest.unstable_mockModule('../models/BookMetadata.js', () => ({
    default: mockBookMetadata,
}));

const { resolvers } = await import('../graphql/resolvers.js');

describe('GraphQL Resolvers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Query', () => {
        it('healthCheck returns correct string', () => {
            const result = resolvers.Query.healthCheck();
            expect(result).toBe("🚀 Backend is up and running!");
        });

        it('authors returns paginated result', async () => {
            const mockAuthors = [{ id: 1, name: 'Test Author' }];
            mockAuthor.findAndCountAll.mockResolvedValue({ count: 1, rows: mockAuthors });

            const result = await resolvers.Query.authors(null, { page: 1, limit: 10 });

            expect(mockAuthor.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
                limit: 10,
                offset: 0,
            }));
            expect(result).toEqual({
                authors: mockAuthors,
                total: 1,
                page: 1,
                limit: 10,
            });
        });

        it('books returns paginated result', async () => {
            const mockBooks = [{ id: 1, title: 'Test Book' }];
            mockBook.findAndCountAll.mockResolvedValue({ count: 1, rows: mockBooks });

            const result = await resolvers.Query.books(null, { page: 1, limit: 10 });

            expect(mockBook.findAndCountAll).toHaveBeenCalled();
            expect(result).toEqual({
                books: mockBooks,
                total: 1,
                page: 1,
                limit: 10,
            });
        });
    });

    describe('Mutation', () => {
        it('createBook creates a book and metadata', async () => {
            const input = { title: 'New Book', author_id: 1 };
            const mockBookData = { id: 10, ...input };
            const userContext = { userId: 1, email: 'author@test.com', role: 'AUTHOR', authorId: 1 };

            mockBook.create.mockResolvedValue(mockBookData);
            mockBook.findByPk.mockResolvedValue(mockBookData);

            const result = await resolvers.Mutation.createBook(null, { input }, { user: userContext });

            expect(mockBook.create).toHaveBeenCalledWith(input);
            expect(mockBookMetadata.create).toHaveBeenCalledWith(expect.objectContaining({
                bookId: 10,
                averageRating: 0,
            }));
            expect(result).toEqual(mockBookData);
        });
    });
});
