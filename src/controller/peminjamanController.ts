import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { date } from "joi";

const prisma = new PrismaClient();

const createPeminjaman = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, itemId } = req.body
        const borrowDate: Date = new Date(req.body.borrowDate)
        const returnDate: Date = new Date(req.body.returnDate)

        const findUser = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })
        if (!findUser) {
            res.status(405).json({
                message: "User not found"
            })
            return
        }
        //mencari item kyknya//
        const findItem = await prisma.barang.findFirst({
            where: {
                id: itemId
            }
        })
        if (!findItem) {
            res.status(406).json({
                message: "Item not found"
            })
            return
        }
        const peminjaman = await prisma.peminjaman.create({
            data: {
                userId,
                itemId,
                borrowDate,
                returnDate
            }
        })

        res.status(200).json({
            message: "Peminjaman has been created",
            data: peminjaman
        })

    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }


}

const returnBarang = async (req: Request, res: Response): Promise<any> => {
    try {
        const borrow_id = req.body.borrowId

        const findBorrow = await prisma.peminjaman.findFirst({
            where: { id: Number(borrow_id) }
        })

        if(!findBorrow) {
            res.status(404).json({
                message: "Record peminjaman not found"
            })
            return
        }

        const return_date : Date = new Date(req.body.returnDate)

        const createReturnRecord = await prisma.pengembalian.create({
            data: {
                peminjamanId: Number(borrow_id),
                actualreturnDate: return_date,
                userId: findBorrow.userId,
                itemId: findBorrow.itemId
            }
        })

        res.status(200).json({
            status: `succes`,
            message: `Pengembalian berhasil`,
            data: createReturnRecord
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred" });
    }
};


const analyzeUsage = async (req: Request, res: Response): Promise<any> => {
try {
    const { start_date, end_date, group_by } = req.body;

    // Ambil data BorrowRecord sesuai tanggal
    const borrowData = await prisma.peminjaman.findMany({
        where: {
            borrowDate: {
                gte: new Date(start_date),
                lte: new Date(end_date),
            },
        },
        include: {
        barang_detail: true, // Include relation ke tabel Items
        },
    });

    const returnData = await prisma.pengembalian.findMany({
        where: {
            actualreturnDate: {
                gte: new Date(start_date),
                lte: new Date(end_date),
            },
        },
    });

    // Grup data berdasarkan `group_by`
    const groupedData = borrowData.reduce((acc: Record<string, any>, borrow) => {
        const group = borrow.barang_detail[group_by as keyof typeof borrow.barang_detail] as string; // Type assertion
        if (!acc[group]) {
            acc[group] = {
                group,
                total_borrowed: 0,
                total_returned: 0,
                items_in_use: 0,
            };
        }

        acc[group].total_borrowed++;
        if (returnData.some((r) => r.peminjamanId === borrow.id)) {
            acc[group].total_returned++;
        } else {
            acc[group].items_in_use++;
        }

        return acc;
    }, {});

    // Ubah objek menjadi array
    const usageAnalysis = Object.values(groupedData);

    // Format respons
    res.status(200).json({
        status: "success",
        data: {
            analysis_period: {
                start_date,
                end_date,
            },
            usage_analysis: usageAnalysis,
        },
    });
} catch (error) {
    console.error(error);
    res.status(500).json(error);
}
};
// =============================================//
// try {
//     const start_date = new Date(req.body.start_date);
//     const end_date = new Date(req.body.end_date);
//     const groupBy = req.body.groupBy; // 'location' or 'category'

//     const input = {
//         start_date: new Date(start_date),
//         end_date: new Date(end_date),
//         groupBy,
//     };

//     const borrowData = await prisma.peminjaman.findMany({
//         where: {
//             borrowDate: {
//                 gte: start_date,
//                 lte: end_date,
//             },
//         },
//         include: {
//             barang_detail: true, // Include relation to Barang table
//         },
//     });

//     const returnData = await prisma.pengembalian.findMany({
//         where: {
//             actualreturnDate: {
//                 gte: start_date,
//                 lte: end_date,
//             },
//         },
//         include: {
//             barang_detail: true, // Correctly include barang_detail from Pengembalian
//         },
//     });

//     // Group data based on group_by
//     const groupedData = borrowData.reduce((acc: Record<string, any>, borrow) => {
//         // Dynamically select the grouping attribute based on groupBy
//         const group = borrow.barang_detail[groupBy as keyof typeof borrow.barang_detail] as string;

//         // Initialize the group if it doesn't exist
//         if (!acc[group]) {
//             acc[group] = {
//                 group,
//                 total_borrowed: 0,
//                 total_returned: 0,
//                 items_in_use: 0,
//             };
//         }

//         // Sum borrowed quantity from the Peminjaman data
//         acc[group].total_borrowed += borrow.barang_detail.quantity;

//         // Find corresponding returns for this borrow record
//         const matchingReturns = returnData.filter(
//             (r) => r.peminjamanId === borrow.id
//         );

//         // Calculate the total returned quantity based on Peminjaman quantity
//         const totalReturned = matchingReturns.reduce((sum, r) => sum + r.barang_detail.quantity, 0);
//         acc[group].total_returned += totalReturned;

//         // Calculate items in use as total borrowed minus total returned
//         acc[group].items_in_use = acc[group].total_borrowed - acc[group].total_returned;

//         return acc;
//     }, {});

//     // Convert object to array
//     const usageAnalysis = Object.values(groupedData);

//     return res.status(200).json({
//         status: "success",
//         data: {
//             analys_periode: {
//                 start: start_date,
//                 end: end_date,
//             },
//             usageAnalysis
//         }
//     });
// } catch (e) {
//     console.error(e);
// }
// }

export { createPeminjaman, returnBarang, analyzeUsage }