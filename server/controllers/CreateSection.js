const Section = require("../models/Section");
const Course = require("../models/Crouse");


exports.CreateSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: flase,
                message: "All fields are required",
            });
        }
        const newSection = await Section.create({ sectionName });
        const upDateCourse = await Course.findByIdAndUpdate(
            courseId,
            {

                $push: { CourseContent: newSection._id, }

            },
            { new: true },

        )
        return res.status(200).json({
            success: true,
            message: 'Section create successfully',
            upDateCourse,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: `Unable to Create Section: ${err.message}`,
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

        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true },);
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