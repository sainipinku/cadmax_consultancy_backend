import nodemailer from "nodemailer";

const sendEmail = async ({ name, email, phone, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"CADMAX Website" <${process.env.MAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "📩 New Website Inquiry",
    html: `
      <h2>New Inquiry Received</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Message:</b><br/>${message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
