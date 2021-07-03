import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

import User from '../entities/User';
export default async (req:Request, res:Response,next: NextFunction) => {
    
    const {JWT_SECRET} = process.env;
    try {
        const token = req.cookies.token
            if(!token) return next()

            const {username}: any = jwt.verify(token,JWT_SECRET!)

            const user = await User.findOne({username})

            res.locals.user = user

            return next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({error:"Unauthenticated"})
    }
}
