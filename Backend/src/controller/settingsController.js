import User from "../models/userModel.js"

export async function getSettings(req, res) {
    try {
        const user = await User.findById(req.userId).select('preferences');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.preferences);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch settings' });
    }
}

export async function updateSettings(req, res) {
    try {
        const { preferences } = req.body;

        // Update specific fields within the preferences object
        // preventing the overwrite of the entire object
        const updateFields = {};
        if (preferences) {
            for (const [key, value] of Object.entries(preferences)) {
                updateFields[`preferences.${key}`] = value;
            }
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update settings' });
    }
}