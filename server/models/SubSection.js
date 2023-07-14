const mongoose = require('mongoose');

const subSectoinSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    timeDuration: {
        type: String,

    },
    videoUrl: {
        type: String,

    }
});
module.exports = mongoose.model("SubSection", subSectoinSchema);