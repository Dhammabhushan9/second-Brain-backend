import express, { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken'
const JWT_PASSWORD="iamgonabehokage";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["token"] as string | undefined; // Cast token as string or undefined

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }
 

    try {
        // Verify the token and decode the user data
        const decodedUser = jwt.verify(token, JWT_PASSWORD) as { _id: string };
       
        if (decodedUser) {
            //@ts-ignore
            req.userId = decodedUser.id;
          
         
            next();
        } else {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token'  });
    }
};