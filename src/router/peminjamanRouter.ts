import { Router } from "express";
import { verifyToken } from "../middleware/authorization";
import { createValidation, returnValidation, usageValidation } from "../middleware/peminjamanValidation";
import { analyzeUsage, createPeminjaman, returnBarang } from "../controller/peminjamanController";

const router = Router();

router.post(`/`, createValidation, createPeminjaman);
router.post(`/return`,returnValidation, returnBarang);
router.post(`/analyze`, [verifyToken], usageValidation, analyzeUsage);

export default router;