import express from 'express'
import { getWeeklyReport } from '../controller/reportController.js'

const router = express.Router()

router.get('/weekly', getWeeklyReport)

export default router
