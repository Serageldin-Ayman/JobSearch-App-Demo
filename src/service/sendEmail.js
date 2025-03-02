import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html, attachments) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.emailSender,
            pass: process.env.emailSenderPassword,
        },
    });

    const info = await transporter.sendMail({
        from: `"Serageldin Ayman" <${process.env.emailSender}>`,
        to: to ? to : "serag.eldin.ayman9@gmail.com",
        subject: subject ? subject : "Hiiiiii",
        html: html ? html : "<b>aloooo</b>",
        attachments: attachments ? attachments : []


    });

    if (info.accepted.length) {
        return true;
    }
    return false;

};