const Course = require("../models/Crouse");
const User = require("../models/User");
const Category = require("../models/Category");
const { ImageUploadCouldinary } = require("../utils/ImageUploader");

// Create Course handle function
exports.CreateCourse = async (req, res) => {
    try {
        let { courseName, courseDescrtion, whatYouWillLearn, price, category, status, tag,
            instructions, } = req.body;
        const thumbnail = req.files.thumbnail;
        if (!courseName || !courseDescrtion || !whatYouWillLearn || !price || !category || !tag || !thumbnail) {
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
            // check for instructor
        } if (!status || status === undefined) {
            status = "Draft";
        }
        const userId = req.User.id;
        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
        });
        console.log("instructorDetial", instructorDetails);
        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not Found",
            });
        }
        // Check if the tag given is valid
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details Not Found",
            });
        }
        // Upload Image to Cloudinary
        const thumbnailImage = await ImageUploadCouldinary(thumbnail, process.env.Folder_name);
        console.log(thumbnailImage);
        const newCrouse = await Course.create({
            courseName,
            courseDescrtion,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            Category: Category._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions: instructions
        });
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCrouse._id,
                }
            },
            { new: true },)
        await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    course: newCrouse._id,
                },
            },
            { new: true }
        );
        // Return the new course and a success message
        res.status(200).json({
            success: true,
            data: newCrouse,
            message: "Course Created Successfully",
        });
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


//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
        //get id
        const { courseId } = req.body;
        //find course details
        const courseDetails = await Course.find(
            { _id: courseId })
            .populate(
                {
                    path: "instructor",
                    populate: {
                        path: "additionalDetails",
                    },
                }
            )
            .populate("category")
            .populate("ratingAndreviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        //validation
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}`,
            });
        }
        //return response
        return res.status(200).json({
            success: true,
            message: "Course Details fetched successfully",
            data: courseDetails,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}