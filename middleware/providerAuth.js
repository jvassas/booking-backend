import jwt from "jsonwebtoken";

// For requests (Not really needed but nice to have)
const providerAuth = async (req, res, next) => {
  try {
    const { pToken } = req.headers;
    if (!pToken) {
      return res.json({ success: false });
    }
    const decode_token = jwt.verify(pToken, process.env.JWT_SECRET);

    if (decode_token !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ success: false });
    }

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

export default providerAuth;
