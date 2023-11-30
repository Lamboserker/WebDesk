import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = async (req, res, next) => {
  console.log("Reached inside AuthMiddleware");

  const authHeader = req.headers.authorization;
  let token = "";
  if (authHeader) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res
      .status(401)
      .json({ msg: "Token is not valid", error: err.message });
  }
};

export default auth;
