import jwt from "jsonwebtoken";

export const socketAuthMiddleware = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const tokenType = socket.handshake.auth.tokenType;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenType === "user") {
      socket.userId = decoded.id;
      socket.userType = "user";
    } else if (tokenType === "doctor") {
      socket.docId = decoded.id;
      socket.userType = "doctor";
    } else if (tokenType === "admin") {
      if (decoded.email !== process.env.ADMIN_EMAIL) {
        return next(new Error("Invalid admin credentials"));
      }
      socket.userType = "admin";
    } else {
      return next(new Error("Invalid token type"));
    }

    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
};
