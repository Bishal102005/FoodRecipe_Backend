const Recipes = require("../models/recipe")

const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipes.find()
        return res.status(200).json(recipes)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id)
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" })
        }
        return res.status(200).json(recipe)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const addRecipe = async (req, res) => {
    try {
        console.log("\n=== ADD RECIPE REQUEST ===")
        console.log("Body:", req.body)
        console.log("File:", req.file)
        console.log("User:", req.user)

        const { title, ingredients, instructions, time } = req.body

        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ message: "Title, ingredients, and instructions are required" })
        }

        if (!req.cloudinaryResult) {
            return res.status(400).json({ message: "Image file is required" })
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated" })
        }


        const imageUrl = req.cloudinaryResult.secure_url
        console.log("Image URL:", imageUrl)

        let ingredientsArray = []
        if (typeof ingredients === 'string') {
            ingredientsArray = ingredients.split(',').map(ing => ing.trim()).filter(ing => ing.length > 0)
        } else if (Array.isArray(ingredients)) {
            ingredientsArray = ingredients.map(ing => typeof ing === 'string' ? ing.trim() : ing).filter(ing => ing)
        }

        console.log("Parsed ingredients:", ingredientsArray)

        const newRecipe = await Recipes.create({
            title: title.trim(),
            ingredients: ingredientsArray,
            instructions: instructions.trim(),
            time: (time && typeof time === 'string') ? time.trim() : "",
            coverImage: imageUrl,
            createdBy: req.user.id
        })

        console.log("Recipe created successfully:", newRecipe._id)

        return res.status(201).json(newRecipe)
    } catch (err) {
        console.error("ADD_RECIPE_ERROR:", err.message, err.stack)
        res.status(500).json({ message: err.message })
    }
}

const editRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id)
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" })
        }

        if (recipe.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to edit this recipe" })
        }

        const updateData = {
            title: req.body.title || recipe.title,
            ingredients: req.body.ingredients ? (Array.isArray(req.body.ingredients) ? req.body.ingredients : req.body.ingredients.split(',').map(i => i.trim()).filter(i => i !== "")) : recipe.ingredients,
            instructions: req.body.instructions || recipe.instructions,
            time: req.body.time || recipe.time,
            coverImage: req.cloudinaryResult ? req.cloudinaryResult.secure_url : recipe.coverImage
        }

        const updatedRecipe = await Recipes.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )

        return res.status(200).json(updatedRecipe)
    } catch (err) {
        console.log("ERROR:", err.message)
        res.status(500).json({ message: err.message })
    }
}

const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipes.findById(req.params.id)
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" })
        }
        if (recipe.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this recipe" })
        }
        await Recipes.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: "Recipe deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe }