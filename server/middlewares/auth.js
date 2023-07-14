const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


exports.auth = async (req, res, next) => {
    try {
        // extract the token 
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
        // if token missing return response ]
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing",
            });

        }


        // verify the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            req.user = decoded;
        }
        catch (err) {
            console.log("while verifiy token " + err);
            return res.status(401).json({
                success: false,
                message: "Token invalid",
            })
        }
        next();
    }
    catch (error) {
        console.log("while auth " + err);
        return res.status(401).json({
            success: false,
            message: "something went wrong while verifying token",
        })
    }

}


// isstudent


exports.isStudent = async (req, res, next) => {
    try {
        if (req.body.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "You must be a student",
            });
        }
        next();
    }
    catch (error) {
        console.log("while auth isstudent" + error);
        return res.status(401).json({
            success: false,
            message: "something went wrong while verifying isstudent",
        });
    }
}
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.body.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "You must be a Instructor",
            });
        }
        next();
    }
    catch (error) {
        console.log("while auth Instructor" + error);
        return res.status(401).json({
            success: false,
            message: "something went wrong while verifying Instructor",
        });
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.body.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "You must be a Admin",
            });
        }
        next();
    }
    catch (error) {
        console.log("while auth Admin" + error);
        return res.status(401).json({
            success: false,
            message: "something went wrong while verifying Admin ",
        });
    }
}