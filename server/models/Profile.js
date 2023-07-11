const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
    },
    dob: {
        type: String,
    },
    about: {
        type: String,
        trim: ture,
    },
    contactNumber: {
        type: Number,
        trim: ture,
    }
});
module.exports = mongoose.model("Profile", profileSchema);