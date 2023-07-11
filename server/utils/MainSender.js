const nodemailer = require('nodemailer');
const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTestAccount({
            host: process.env.Mail_host,
            auth: {
                user: process.env.Mail_user,
                password: process.env.Mail_password,
            }

        });
        let info = await transporter.sendMail({
            from: 'Prabhat saini || Welcome ',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        console.log(info);
        return info;

    }
    catch (e) {
        console.log(e.message);
    }

}

module.exports = mailSender;