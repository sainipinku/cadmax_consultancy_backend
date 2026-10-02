import nodemailer from "nodemailer";

const getTransporter = () => {
    if (!process.env.MAIL_USER) {
        throw new Error("MAIL_USER is missing in .env");
    }

    if (!process.env.MAIL_PASSWORD) {
        throw new Error("MAIL_PASSWORD is missing in .env");
    }

    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,

        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });
};

export const verifyMailConnection = async () => {
    try {
        const transporter = getTransporter();

        await transporter.verify();

        console.log("✅ Gmail SMTP connected");
        console.log("✅ Mail User:", process.env.MAIL_USER);

        return true;
    } catch (error) {
        console.error("❌ SMTP CONNECTION ERROR");
        console.error(error.message);

        return false;
    }
};

export const sendMail = async ({
    to,
    subject,
    html,
    replyTo,
}) => {
    const transporter = getTransporter();

    const result = await transporter.sendMail({
        from: `"CADMAX Website" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
        replyTo,
    });

    return result;
};