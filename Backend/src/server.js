import express from "express";
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/taskRoutes.js'
import workRoutes from './routes/workRoutes.js'
import userRoutes from './routes/userRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import "./cron/taskFailure.cron.js"

dotenv.config()
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/health', (req, res) => {
    res.status(200).send("ok")
})

app.get('/', (req, res) => {
    res.send("ok")
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/task', authMiddleware, todoRoutes)
app.use('/api/work', authMiddleware, workRoutes)
app.use('/api/settings', authMiddleware, settingsRoutes)
app.use('/api/user', authMiddleware, userRoutes)
app.use('/api/report', authMiddleware, reportRoutes)

// Connecting to Database
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB')
}).catch((error) => {
    console.log(error)
})

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)

})
