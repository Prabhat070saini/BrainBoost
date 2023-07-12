const Course = require("../models/Crouse");
const User = require("../models/User");
const Tag = require("../models/Tags");
const { ImageUploadCouldinary } = require("../utils/ImageUploader");

// Create Course handle function
exports.CreateCourse = async (req, res) => {
    try {
        const { courseName, courseDescrtion, whatYouWillLearn, price, tag } = req.body;
        const thumbnail = req.files.thumbnail;
        if (!courseName || !courseDescrtion || !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
            // check for instructor
        }
        const userId = req.User.id;
        const instructorDetails = await User.findById(userId);
        console.log("instructorDetial", instructorDetails);
        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not Found",
            });
        }

        // Upload Image to Cloudinary
        const thumbnailImage = await ImageUploadCouldinary(thumbnail, process.env.Folder_name);
        const newCrouse = await Course.create({
            courseName,
            courseDescrtion,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: Tag._id,
            thumbnail: thumbnailImage.secure_url,
        });
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCrouse._id,
                }
            },
            { new: true },)

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "failed to create course",
        })
    }
}


// getAllCourse handler function
exports.getAllCourses = async (req, res) => {
    try {
        const allCourse = await Course.find({}, {
            courseDescrtion: true,
            courseName: true,
            instructor: true,

        }).populate("instructor").exec();
        return res.status(200).json({
            success: true,
            message: "Data all courses fetched successfully",
            data: allCourse,
        })
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "cannot fetch data",
            error: e.message,
        });
    }
}




// getAllCourse handle function

