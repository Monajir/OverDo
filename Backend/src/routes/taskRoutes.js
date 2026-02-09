import express from "express";
import { getAllTasks, createNewTask, updateTask, deleteTask, completeTask, completePomodoro } from "../controller/taskController.js";

const router = express.Router();

// Get all tasks for the logged-in user
router.get('/', getAllTasks)
