import jwt from "jsonwebtoken";

const JWT_SECRET = "secret" // Use a secure env value

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info to request object
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role:decoded.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authenticate;
