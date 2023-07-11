const mongoose = require('mongoose');

const subSectoinSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    timeduration: {
        type: String,

    },
    videourl: {
        type: String,

    }
});
module.exports = mongoose.model("SubSection", subSectoinSchema);