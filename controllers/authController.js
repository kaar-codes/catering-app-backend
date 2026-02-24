import jwt from "jsonwebtoken";

export async function authenticateUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ").at(-1);
    const isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (isVerified) {
      next();
    } else {
      throw new Error("Authorization token has expired");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}
