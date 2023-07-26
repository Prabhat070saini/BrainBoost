const express = require('express');
const app = express();

const userRouter = require("./routes/User");
const profileRouter = require("./routes/Profiles");
const paymentRouter = require("./routes/Payments");
const courseRouter = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

require("dotenv").config();
const database = require("./config/database");
const cookieParser = require('cookie-parser')
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const expressfileupload = require("express-fileupload");
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 5000;

database.connect();

// add middleware 
app.use(express.json());
app.use(cookieParser())
app.use(
    cors({
        origin: '*',
        credential: true,
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

// cloudnary connectoion

cloudinaryConnect();

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/reach", contactUsRoute);
// app.use("/api/v1/payment", paymentRoutes);


app.get("/", (req, res) => {

    return res.json({
        success: true,
        message: "Success running...Prabhatsaini"
    })
});


app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});