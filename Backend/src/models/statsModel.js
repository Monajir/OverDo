import mongoose from 'mongoose'

const Schema = mongoose.Schema

// Optional [ For Generating the UI, Insults and Character emotion dynamically ]
const statsSchema = new Schema({
  

}, { timestamps: true })

export default mongoose.model('Stats', statsSchema)