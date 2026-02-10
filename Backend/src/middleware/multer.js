import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "overdo/tasks",
        allowed_formats: ["jpg", "png", "jpeg", "pdf", "txt", "docx"],
        resource_type: "auto",
    },
});

const upload = multer({ storage: storage });

export default upload;
