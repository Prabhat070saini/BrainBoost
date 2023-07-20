const User = require("../models/User");
const Profile = require("../models/Profile");
const { ImageUploadCouldinary } = require("../utils/ImageUploader");

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
        const userDetails = await User.findOne({
            _id: userId,
        })
            .populate("courses")
            .exec()
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
            message: error.message,
        })
    }
};