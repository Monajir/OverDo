import express from "express";
import { getAllTasks, createNewTask, updateTask, deleteTask, completeTask, completePomodoro } from "../controller/taskController.js";

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

// Complete aPomodoro
router.put('/:id/pomodoro', completePomodoro)

export default router