require("dotenv").config()
const express = require("express")
const app = express()
const connectDb = require("./config/connectionDb")
const cors = require("cors")
const PORT = process.env.PORT || 3000

connectDb().catch((err) => {
    console.error("Failed to connect to database:", err)
    process.exit(1)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use(cors({
    origin: 'https://kitchen-story.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))
// app.options('(.*)', cors()) // preflight handled by app.use(cors()) below

app.use(express.static("public"))
app.use("/", require("./routes/user"))
app.use("/recipe", require("./routes/recipe"))

// Global error handler
app.use((err, req, res, next) => {
    console.error("\n=== GLOBAL ERROR HANDLER ===")
    console.error("Error name:", err.name)
    console.error("Error message:", err.message)
    const errorMessage = err.message || "Internal Server Error"
    res.status(err.status || 500).json({
        message: errorMessage,
        error: err.name,
        code: err.code,
        stack: err.stack
    })
})

app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`)
})