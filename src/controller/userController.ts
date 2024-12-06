import { Peminjaman, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "minimal" });
type roleType = "Admin" | "User";

const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const name : string = req.body.name;
        const username: string = req.body.username;
        const password : string = req.body.password;
        const role : roleType = req.body.role;

        const findUser = await prisma.user.findFirst({
            where: {
                username,
            },
        });

        if (findUser) {
            return res.status(400).json({
                status : 'success',
                message: `Username has exists, please try another name!`,
                
            });
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                password: hashPassword,
                role
            },
        });
        return res.status(200).json({
            status : 'success',
            message: `New user has been created`,
            data: newUser,
        })
    } catch (error) {
        return res.status(501).json(error);
    }

};

const readUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = req.query.search;
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: search?.toString() || "" } },
                ],
            },
        });
        return res.status(200).json({
            status : 'success',
            message: `Data User Berhasil Ditemukan`,
            data: users,
        });
    } catch (error) {
        return res.status(502).json(error);
    }
}
const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;

        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(id),
            },
        });

        if (!findUser) {
            return res.status(250).json({
                status : 'success',
                message: `User is not found!`,
            });
        }

        const { username, password } = req.body;

        const saveUser = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                username: username ? username : findUser.username,
                password: password ? await bcrypt.hash(password, 12) : findUser.username,
            },
        });

        return res.status(200).json({
            status : 'success',
            message: `User has been updated`,
            data: saveUser,
        });
    } catch (error) {
        return res.status(503).json(error);
    }
}

const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;

        const findUser = await prisma.user.findFirst({
            where: {
                id: Number(id),
            },
        });

        if (!findUser) {
            return res.status(250).json({
                status : 'success',
                message: `User is not found!`,
            });
        }

        const saveUser = await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });

        return res.status(200).json({
            status : 'success',
            message: `User has been removed`,
            data: saveUser,
        });
    } catch (error) {
        return res.status(504).json(error);
    }
}

const authentication = async (req: Request, res: Response): Promise<any> => {
    try {
      const { username, password } = req.body;
      const findUser = await prisma.user.findFirst({ where: { username } });
      if (!findUser) {
        return res.status(200).json({ message: "Username not registered" });
      }

      
      const isMatchPassword = await bcrypt.compare(password, findUser.password);
      if (!isMatchPassword) {
        return res.status(200).json({ message: "Invalid Password" });
        //// KESALAHAN PADA findUser.username harusnya findUser.password tapi di Postman kebalik\\\
        
      }

    //   if (findUser.role === "Admin") {
    //     return res.status(200).json({ 
    //         message : "You are allowed to login"
    //      });
    //   }
      // prepare to generate token using JWT \\
      const payload = {
        username: findUser.username,
        role: findUser.role
      };

      if (!process.env.SECRET) {
    throw new Error("JWT secret is missing in environment variables");
}
      const signature = process.env.SECRET || ``;
  
      const token = jwt.sign(payload, signature);
  
      return res.status(200).json({ 
        status: "success",
            message: `Login berhasil`,
            token,
       });
    } catch (error) {
      console.log(error);
  
    //   return res.status(505).json(error);
      return res.status(505).json({ message: "Internal Server Error", error });
    }
  };

  export { createUser, readUser, updateUser, deleteUser, authentication };