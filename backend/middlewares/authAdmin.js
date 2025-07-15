import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;
        if (!atoken) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please log in again." });
        }

        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Forbidden. Invalid admin credentials." });
        }

        next();
    } catch (error) {
        console.log("Error in authAdmin:", error);
        res.status(500).json({ success: false, message: "Authentication error" });
    }
};

export default authAdmin;
