import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = async (req, res, next) => {
  console.log("reached inside AuthMiddleware");
  // Get the token from the header
  // const token = req.header("x-auth-token");
  const authHeader = req.headers.authorization;
  let token = "";
  if (authHeader) {
    // Split the header into 'Bearer' and the token part
    token = authHeader.split(" ")[1];
    // Now you have the token, you can do something with it
    // For example, save it in the request object
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded.user; 
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;
