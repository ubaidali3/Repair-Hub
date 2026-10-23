import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
export async function auth(req, res, next) {
  try {
    const token = req.cookies?.access_token;
    if (!token)
      return res.status(401).json({ error: "Authentication required" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user || user.suspended)
      return res.status(401).json({ error: "Session invalid" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Session expired or invalid" });
  }
}
export const roles =
  (...allowed) =>
  (req, res, next) =>
    allowed.includes(req.user.role)
      ? next()
      : res.status(403).json({ error: "Forbidden" });
