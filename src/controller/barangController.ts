import { PrismaClient } from "@prisma/client";
import exp from "constants";
import { Request, Response } from "express";

const prisma = new PrismaClient({ errorFormat: "minimal" });

const createBarang = async (req: Request, res: Response): Promise<any> => {
    try {
        const name: string = req.body.name;
        const category: string = req.body.category;
        const location: string = req.body.location;
        const quantity: number = Number(req.body.quantity);

        const newBarang = await prisma.barang.create({
            data: {
                name,
                category,
                location,
                quantity,
            },
        });
        res.status(200).json({
            status: "success",
            message: newBarang
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const readBarang = async (req: Request, res: Response): Promise<any> => {
    try {
        const search = req.query.search;
        const allBarang = await prisma.barang.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: search?.toString() || "",
                        },
                    },
                ],
            },
        });
        return res.status(200).json({
            status: "success",
            message: "Barang has been retrieved",
            data: allBarang,
        });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateBarang = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;
        const findBarang = await prisma.barang.findFirst({
            where: { id: Number(id) },
        })
        if (!findBarang) {
            return res.status(200).json({ message: "Barang is not found" })
        }
        const { name, category, location, quantity } = req.body
        const saveBarang = await prisma.barang.update({
            where: { id: Number(id) },
            data: {
                name,
                category,
                location,
                quantity,
            },
        })
        return res.status(200).json({ message: "Barang has been updated", data: saveBarang })
    } catch (error) {
        return res.status(500).json(error)
    }
}

const deleteBarang = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id
        const findBarang = await prisma.barang.findFirst({
            where: { id: Number(id) },
        })
        if (!findBarang) {
            return res.status(200).json({ message: "Barang is not found" })
        }
        const saveBarang = await prisma.barang.delete({
            where: { id: Number(id) },
        })
        return res.status(200).json({ message: "Barang has been removed", data: saveBarang })
    } catch (error) {
        return res.status(500).json(error)
    }
}
export { createBarang, readBarang, updateBarang, deleteBarang }