import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const dToken = req.headers.dtoken || req.headers.dToken || req.headers.DToken;
    console.log("Doctor Token:", dToken);

    if (!dToken) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in again." });
    }

    const token_decode = jwt.verify(dToken, process.env.JWT_SECRET);

    // ✅ Attach docId for downstream use
    req.body.docId = token_decode.id;
    console.log("Decoded Token:", token_decode);
    console.log("Extracted docId:", req.body.docId);
    next();
  } catch (error) {
    console.log("Error in authDoctor:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default authDoctor;
