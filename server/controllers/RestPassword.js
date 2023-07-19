const User = require("../models/User");
const mailSender = require("../utils/MainSender");
const crypto = require("crypto");
const bcrypt = require("bcrypt");


// Generate reset token
exports.generateResetToken = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: "your email not registered with us,"
            });
        }
        const token = crypto.randomBytes(20).toString("hex");
        const updateDetails = await User.findOneAndUpdate({ email: email }, { token: token, reSetPasswordExpires: Date.now() + 5 * 60 * 1000 });
        const url = `http://localhost:3000/update-password/${token}`;
        await mailSender(email, "Password Reset Link", `Password Reset Link:${url}`);
        return res.json({
            success: true,
            message: `Email sent successfully,Please check email and changes password`,
            url,
        });
    } catch (error) {
        console.log(`Error genrateResetToken: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while sending reset pwd mail'
        });
    }
}

// resetPassword
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;
        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        const userDetails = await User.findOne({ token: token });
        if (!userDetails) {
            return res.json({
                success: false,
                message: "token invalid"
            });
        }
        // token time checked
        if (userDetails.reSetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "token expired",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate({ token: token }, { password: hashedPassword }, { new: true });
        return res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });


    }
    catch (error) {
        console.log(`Error while reset password;  ${error.message}`);;
        return res.status(500).json({
            success: false,
            message: 'error while reset password',
        });
    }
}
