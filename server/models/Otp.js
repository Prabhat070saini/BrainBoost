const mongoose = require('mongoose');
const mailSender = require('../utils/MainSender');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    },
    contactNumber: {
        type: Number,
        trim: true,
    }
});

// a function -> send mail
const sendverficationmail = async (email, otp) => {
    try {
        const mailResponse = await mailSender(email, "verfication mail for signUp", otp);
        console.log("email send succesfully:", mailResponse);
    }
    catch (err) {
        console.log('error occured while seding email: ', err);
        throw err;
    }

}
otpSchema.pre("save", async (next) => {
    await sendverficationmail(this.email, this.otp);
    next();

})
module.exports = mongoose.model("Otp", otpSchema);