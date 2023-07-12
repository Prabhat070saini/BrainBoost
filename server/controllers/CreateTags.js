const Tag = require("../models/Tags");

exports.CreateTags = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
            // create a instance in database
        }
        const tagsDetails = Tag.create({
            name: name,
            description: description,
        });
        console.log(`tagsDetails${tagsDetails}`);
        return res.status(200).json({
            success: true,
            message: "tag created successfully",
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


// Get all tag handlers functions
exports.showAlltags = async (req, res) => {

    try {
        const allTags = Tag.find({}, { name: true }, { description: true });
        return res.status(200).json({
            success: true,
            message: "All tags found",
            allTags,
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};