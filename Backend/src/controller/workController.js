import Work from "../models/workModel.js";
import Task from "../models/taskModel.js";

export async function getAllWorks(req, res) {
    try {
        const works = await Work.find({ user: req.userId });
        res.json(works);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch folders' });
    }
}

export async function createNewWork(req, res) {
    try {
        const { name, color } = req.body;
        const work = await Work.create({ name, color, user: req.userId });
        res.json(work);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create folder' });
    }
}

export async function deletWork(req, res) {
    try {
        const workId = req.params.id
        const work = await Work.findOneAndDelete({ _id: workId, user: req.userId });

        const tasks = await Task.deleteMany({ workId })

        if (!work) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        res.json(work);
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete folder' });
    }
}