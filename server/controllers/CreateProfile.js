const User = require("../models/User");
const Profile = require("../models/Profile");
const { ImageUploadCouldinary } = require("../utils/ImageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Crouse");
exports.UpdateProfile = async (req, res) => {
    try {
        const { dateOfBirth, about = "", constactNumber, gender } = req.body;
        const id = req.user.id;
        console.log("user id: " + id);
        console.log("date of birth: " + dateOfBirth)
        if (!dateOfBirth || !about || !gender || !id) {
            console.log(dateOfBirth, about, gender);
            console.log(id)
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }

        const userDetails = await User.findById(id);
        console.log(userDetails);
        const profileId = userDetails.additionalDetails;
        console.log(`profileid $`);
        const profileDtails = await Profile.findById(profileId);
        profileDtails.contactNumber = constactNumber;
        profileDtails.gender = gender;
        profileDtails.about = about;
        profileDtails.dob = dateOfBirth;
        console.log(profileDtails);
        await profileDtails.save();
        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profileDtails,

        });
    }
    catch (err) {
        console.error("while updating profile", err);
        return res.status(404).json({
            success: false,
            message: err.message,
        })
    }
}


exports.deleteAccount = async (req, res) => {
    try {
        // TODO: Find More on Job Schedule
        // const job = schedule.scheduleJob("10 * * * * *", function () {
        // 	console.log("The answer to life, the universe, and everything!");
        // });
        // console.log(job);


        const id = req.user.id;
        const user = await User.findById({ _id: id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // Delete Assosiated Profile with the User

        console.log("The answer to life, the universe, and everything!", user.additionalDetails);
        await Profile.findByIdAndDelete({ _id: user.additionalDetails });
        // TODO: Unenroll User From All the Enrolled Courses
        // Now Delete User
        await User.findByIdAndDelete({ _id: id });
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "User Cannot be deleted successfully" });
    }
};

exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();
        console.log(userDetails);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id
        // console.log(`afs`)
        const image = await ImageUploadCouldinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)
        const updatedProfile = await User.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        )
        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        })
    } catch (error) {
        console.log("under catch in updatedisplaypicture")
        return res.status(500).json({

            success: false,
            message: error.message,
        })
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        let userDetails = await User.findOne({
            _id: userId,
        })
            .populate({
                path: "courses",
                populate: {
                    path: "CourseContent",
                    populate: {
                        path: "subsection",
                    },
                },
            })
            .exec()


        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            for (var j = 0; j < userDetails.courses[i].CourseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].CourseContent[
                    j
                ].subsection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                    totalDurationInSeconds
                )
                SubsectionLength +=
                    userDetails.courses[i].CourseContent[j].subsection.length
            }
            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            })
            courseProgressCount = courseProgressCount?.completedVideos.length
            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
            } else {
                // To make it up to 2 decimal point
                let multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage =
                    Math.round(
                        (courseProgressCount / SubsectionLength) * 100 * multiplier
                    ) / multiplier
            }
        }
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            })
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `achqa${error.message}`,
        })
    }
};


exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id })
        console.log(courseDetails, "course")
        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnroled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescrtion: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            }

            return courseDataWithStats
        })

        res.status(200).json({ courses: courseData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: `Error ${error.message}` })
    }
}