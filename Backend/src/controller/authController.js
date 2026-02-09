import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import Work from '../models/workModel.js'
import dotenv from 'dotenv'
dotenv.config()

export async function login(req, res) {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'No user found with this email' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' })
        res.json({ token })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function register(req, res) {
    try {
        const { username, password, email } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ username, password: hashedPassword, email })

        // Create a Standalone work folder for all new users
        await Work.create({ name: 'Standalone', color: '#FF0000', user: user._id })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' })
        res.json({ token })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}