import jwt from "jsonwebtoken";

const providerAuth = (req, res, next) => {
  try {
    const { pToken } = req.headers;

    // Check if token is provided
    if (!pToken) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing.",
      });
    }

    // Verify the token
    const decodedToken = jwt.verify(pToken, process.env.JWT_SECRET);

    // Validate decoded token against admin credentials
    const validToken = `${process.env.ADMIN_EMAIL}${process.env.ADMIN_PASSWORD}`;

    if (decodedToken !== validToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid authorization token.",
      });
    }

    // Token is valid, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Authorization error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error during authorization.",
    });
  }
};

export default providerAuth;
