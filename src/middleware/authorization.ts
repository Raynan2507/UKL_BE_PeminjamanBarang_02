import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

// Middleware untuk verifikasi token
const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const header = req.headers.authorization;
  
      if (!header) {
        return res.status(401).json({ message: "Authorization token is missing" });
      }
  
      const [type, token] = header ? header.split(" ") : [];
  
      if (type !== "Bearer" || !token) {
        return res.status(402).json({ message: "Invalid token format" });
      }
  
      const signature = process.env.SECRET || "";
      const isVerified: any = jwt.verify(token, signature);
  
      if (isVerified.role !== "Admin") {
        return res.status(403).json({ message: "Access restricted to admin only" });
      }
      if (!isVerified) {
        return res.status(404).json({
          messgae: "Unauthorized",
        });
      }
      next();
    } catch (error) {
      return res.status(405).json({ messege: error });
    }
  };

export { verifyToken};