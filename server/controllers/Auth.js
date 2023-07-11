const User = require("../models/User");
const OTP = require("../models/Otp");
const Otp_genrator = require("otp-generator");
const bycrpt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Send otp login for signup
exports.sendOtp = async (req, res) => {

    try {
        // extract Email from request
        const { email } = req.body;

        // check if user is alread exsist email
        const CheckUserPresent = await User.findOne({ email });

        // if user exists return response 
        if (CheckUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already exists",
            });
        }
        // Genrate Otp 
        let otp = Otp_genrator.generate(6, {
            specialChars: false,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
        });
        console.log(`Genrated otp-> ${otp}`);
        // check unique otp or not
        const result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = Otp_genrator.generate(6, {
                specialChars: false,
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
            });
            // console.log(`Genrated otp-> ${otp}`);
            // check unique otp or not
            result = await OTP.findOne({ otp: otp });
        }
        const otp_payload = { email, otp };


        // create an entity in the database
        const otpbody = await OTP.create(otp_payload);
        console.log(otpbody);


        //  retrun response
        return res.status(200).json({
            success: true,
            message: 'otp send successfully',
        });
    }
    catch (error) {
        console.log(`otp send error: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'otp send failed',
        });
    }
}


//  signUp Function 
exports.signUp = async (req, res) => {


    try {
        //    fetch data from the req body
        const { firstName, lastName, email, password, confirmedPassword, contactNumber, otp, accountType } = req.body;

        // validate email and password
        if (!email || !password || !confirmedPassword || !otp || !firstName || !lastName) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            });
        }
        if (password !== confirmedPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match with confirmed password',
            });
        }
        // check if user is alread exsist email
        const CheckUserPresent = await User.findOne({ email });
        if (CheckUserPresent) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // find most recently otp 
        const recentotp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(`recentotp-> ${recentotp}`);

        // validate otp
        if (recentotp.length == 0) {
            // otp not found 
            return res.status(404).json({
                success: false,
                message: "otp not found",
            });

        }
        else if (recentotp !== otp) {
            return res.status(404).json({
                success: false,
                message: "invalid otp",
            });
        }

        // Hash Password
        const Hashedpassword = await bycrpt.hash(password, 10);

        // entry create in database
        const profileDtails = await Profile.create({
            gender: null,
            dob: null,
            about: null,
            contactNumber: null,
        });
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: Hashedpassword,
            accountType,
            additionalDetails: profileDtails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });
        return res.status(200).json({
            success: true,
            message: `Account Successfully created`,
        })
    }
    catch (error) {
        console.log(`Error while singUp${error}`);
        return res.status(500).json({
            success: false,
            message: `An error occurred while singup Try again later`,
        });


    }
}

// Login 

exports.login = async (req, res,) => {
    try {
        //  fetch data from req
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User does not exist Please first SingUp',
            });
        }
        // check password and create jwt token
        if (await bycrpt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                role: user.accountType,
            }
            const token = await jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;
            // Genrate cookie
            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, option).status(200).json({
                success: true,
                token,
                user,
                message: `Logged in successfully`,
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: `Invalid password`,
            });
        }
    }
    catch (error) {
        console.log(`error while logging in: ${error}`);
        return res.status(500).json({
            success: false,
            message: `Loggined failed Try again later`,
        })
    }

}
// change password homework