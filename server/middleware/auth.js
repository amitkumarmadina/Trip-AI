import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  let token;

  // Read token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "tripai_cosmic_secret_key_123!");
    // Attach user ID from payload to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ error: "Not authorized, token invalid" });
  }
}
