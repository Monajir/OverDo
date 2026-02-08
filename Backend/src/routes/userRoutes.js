import express from "express";
import { getCurrentUser, deleteUser } from "../controller/userController.js";

const router = express.Router();

router.get('/me', getCurrentUser);
router.delete('/me', deleteUser);

export default router;
