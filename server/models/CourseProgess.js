const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
   courseID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crouse",
   },
   completedVideo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "subSection",
   },],
});
module.exports = mongoose.model("CourseProgress", courseProgressSchema);