import { verifyAccessToken } from "../utils/jwt.js";

export const extractAuthContext = ({ req }) => {
  let user = null;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        authorId: payload.authorId,
      };
    }
  }

  return { user, token };
};

export const requireAuth = (user) => {
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
};

export const requireRole = (user, allowedRoles) => {
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden: Insufficient permissions");
  }
};

export const canManageBook = (user, book) => {
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  const isAdmin = user.role === "ADMIN";
  const isBookOwner = book.author_id === user.authorId;
  
  if (!isAdmin && !isBookOwner) {
    throw new Error("Forbidden: You can only manage your own books");
  }
};
