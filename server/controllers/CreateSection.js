const Section = require("../models/Section");
const Course = require("../models/Crouse");


exports.CreateSection = async (req, res) => {
    try {
        // Extract the required properties from the request body
        const { sectionName, courseId } = req.body;

        // Validate the input
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing required properties",
            });
        }

        // Create a new section with the given name
        const newSection = await Section.create({ sectionName });


        // Add the new section to the course's content array
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    CourseContent: newSection._id,
                },
            },
            { new: true }
        )
            .populate({
                path: "CourseContent",
                populate: {
                    path: "subsection",
                },
            })
            .exec();
        console.log(`newsection k bad`)

        // Return the updated course object in the response
        res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


// Update section

exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId } = req.body;
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: flase,
                message: "All fields are required",
            });
        }

        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });
        return res.status(200).json({
            success: true,
            message: 'Section updated successfully',
            upDateCourse,
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Unable to Update Section: ${err.message}`,
        });
    }

};

// Update section
exports.deleteSection = async (req, res) => {

    try {
        const { sectionId } = req.params;
        await Section.findByIdAndDelete(sectionId);
        // do we need to delete section id from the course schema

        return res.status(200).json({
            success: true,
            message: 'Section delete successfully',

        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Unable to delete Section: ${err.message}`,
        });
    }
};