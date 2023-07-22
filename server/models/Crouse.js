const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        // trim: true,
    },
    courseDescrtion: {
        type: String,
        // required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
        // trim: ture,
        // required: true,
    },
    CourseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
    }],
    ratingAndReview: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
    }],
    price: {
        type: Number,
        required: true,

    },
    thumbnail: {
        type: String,
    },
    tag: {
        type: [String],
        required: true,
    },
    Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    studentsEnroled: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }],
    instructions: {
        type: [String],
    },
    status: {
        type: String,
        enum: ["Draft", "Published"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});
module.exports = mongoose.model("Course", courseSchema);