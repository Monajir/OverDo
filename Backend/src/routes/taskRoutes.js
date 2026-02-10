import express from "express";
import { getAllTasks, createNewTask, updateTask, deleteTask, completeTask, completePomodoro, addAttachment, deleteAttachment } from "../controller/taskController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Get all tasks for the logged-in user
router.get('/', getAllTasks)

// Create a new task
router.post('/', createNewTask)

// Update a task
router.put('/:id', updateTask)

// Delete a task
router.delete('/:id', deleteTask)

// Complete a task
router.post('/:id/complete', completeTask)

//// Task Fail is handled by cron job

// Complete a Pomodoro
router.put('/:id/pomodoro', completePomodoro)

// Attachments
router.post('/:id/attachments', upload.single('file'), addAttachment)
router.delete('/:id/attachments/:index', deleteAttachment)

export default router