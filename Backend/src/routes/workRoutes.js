import express from "express";
import { createNewWork, deletWork, getAllWorks } from "../controller/workController.js";

const router = express.Router();

// Get all works for the logged-in user
router.get('/', getAllWorks);

// Create a new work/folder
router.post('/', createNewWork);

// Delete a work/folder
router.delete('/:id', deletWork);

export default router;
