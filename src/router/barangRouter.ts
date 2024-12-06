import { Router } from "express";
import { createBarang, deleteBarang, readBarang, updateBarang } from "../controller/barangController";
import { createValidation } from "../middleware/barangValidation";
import { updateValidation } from "../middleware/barangValidation";
import { verifyToken } from "../middleware/authorization";

const router = Router();

router.post(`/`, [verifyToken], createValidation, createBarang);

router.get(`/`, readBarang);

router.put(`/:id`, [verifyToken], updateValidation, updateBarang);

router.delete(`/:id`,[verifyToken], deleteBarang);

export default router