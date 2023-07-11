const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        trim: true,
    },
    courseDescrtion: {
        type: String,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
        trim: ture,
        required: true,
    },
    CourseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
    }],
    ratingAndReview: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratingAndReview",
    }],
    price: {
        type: Number,
        required: true,

    },
    thumbnail: {
        type: String,
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
    },
    studentEnroll: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }]

});
module.exports = mongoose.model("Course", courseSchema);