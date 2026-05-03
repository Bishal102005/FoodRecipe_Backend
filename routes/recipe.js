const express = require("express")
const multer = require("multer")
const cloudinary = require('cloudinary').v2
const { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe } = require("../controller/recipe")
const verifyToken = require("../middleware/auth")
const router = express.Router()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Use memory storage — file is kept in buffer, never touches disk
const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Only image files (jpeg, png, gif, webp) are allowed!'), false)
        }
        cb(null, true)
    }
})

// Helper: upload buffer to Cloudinary via stream
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'food_recipes',
                resource_type: 'image'
            },
            (error, result) => {
                if (error) return reject(error)
                resolve(result)
            }
        )
        stream.end(buffer)
    })
}

// Attach uploadToCloudinary so controllers can use it
router.uploadToCloudinary = uploadToCloudinary

router.get("/", getRecipes)
router.get("/:id", getRecipe)
router.post("/", verifyToken, upload.single("file"), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" })
        }
        // Upload buffer to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer)
        req.cloudinaryResult = result
        next()
    } catch (err) {
        console.error("Cloudinary upload error:", err)
        next(err)
    }
}, addRecipe)
router.put("/:id", verifyToken, upload.single("file"), async (req, res, next) => {
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer)
            req.cloudinaryResult = result
        }
        next()
    } catch (err) {
        console.error("Cloudinary upload error:", err)
        next(err)
    }
}, editRecipe)
router.delete("/:id", verifyToken, deleteRecipe)

module.exports = router