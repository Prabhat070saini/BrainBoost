const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            services: `gmail`,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            port: 465,
            host: process.env.MAIL_HOST,
        })


        let info = await transporter.sendMail({
            from: `prabhat07saini@gmail.com`,
            to: `amansaini@gmail.com`,
            subject: `verfiemail`,
            // html: `<h1>65364</h1>`,
            text: `testing`
        });
        console.log(info);
        return info;
    }
    catch (error) {
        console.log("inside mainsender utils--", error.message);
        // console.error(error.responce.message);
        // return res.status(404).json({
        //     success: false,
        //     message: "mailsend error"
        // })
    }
}


module.exports = mailSender;