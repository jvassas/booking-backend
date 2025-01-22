import jwt from "jsonwebtoken";

const clientAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization; // Use 'authorization' header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized: Token missing or invalid",
      });
  }

  // Extract the token from the 'Bearer <token>' format
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the client ID to the request body
    req.body.clientId = decoded.id;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log("Error verifying token:", error.message);
    res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

export default clientAuth;
