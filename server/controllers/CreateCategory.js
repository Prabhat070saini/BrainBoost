const Category = require("../models/Category");

exports.CreateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
            // create a instance in database
        }
        const CategoryDetails = Category.create({
            name: name,
            description: description,
        });
        console.log(`CategoryDetails${CategoryDetails}`);
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


// Get all Category handlers functions
exports.showAllCategory = async (req, res) => {

    try {
        const allCategory = Category.find({}, { name: true }, { description: true });
        return res.status(200).json({
            success: true,
            message: "All Category found",
            allCategory,
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};



//categoryPageDetails 



exports.categoryPageDetails = async (req, res) => {
    try {
        //get categoryId
        const { categoryId } = req.body;
        //get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId)
            .populate("courses")
            .exec();
        //validation
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Data Not Found',
            });
        }
        //get coursesfor different categories
        const differentCategories = await Category.find({
            _id: { $ne: categoryId },//not include except categoryid 
        })
            .populate("courses")
            .exec();

        //get top 10 selling courses
        //HW - write it on your own

        //return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
            },
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}