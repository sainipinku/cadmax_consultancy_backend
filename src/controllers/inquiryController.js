import { sendMail } from "../services/mailService.js";

export const sendInquiry = async (req, res) => {
    try {
        console.log("=================================");
        console.log("NEW CONTACT INQUIRY");
        console.log("BODY:", req.body);
        console.log("MAIL USER:", process.env.MAIL_USER);
        console.log(
            "MAIL PASSWORD EXISTS:",
            Boolean(process.env.MAIL_PASSWORD)
        );
        console.log(
            "MAIL TO:",
            process.env.MAIL_TO
        );
        console.log("=================================");

        const {
            fullName,
            email,
            phone,
            message,
        } = req.body;

        // ==============================
        // Validation
        // ==============================

        if (!fullName?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Full name is required.",
            });
        }

        if (!email?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        if (!phone?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required.",
            });
        }

        if (!message?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project brief is required.",
            });
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email.",
            });
        }

        // ==============================
        // Email
        // ==============================

        const info = await sendMail({
            to:
                process.env.MAIL_TO ||
                process.env.MAIL_USER,

            replyTo: email.trim(),

            subject:
                `New Website Inquiry - ${fullName.trim()}`,

            html: `
        <!DOCTYPE html>

        <html>
          <body
            style="
              margin:0;
              padding:30px;
              background:#f5f3ee;
              font-family:Arial,sans-serif;
            "
          >

            <div
              style="
                max-width:650px;
                margin:auto;
                background:white;
                border:1px solid #ddd;
              "
            >

              <div
                style="
                  background:#24211D;
                  color:white;
                  padding:25px;
                "
              >

                <h2
                  style="
                    margin:0;
                  "
                >
                  New Project Inquiry
                </h2>

                <p
                  style="
                    margin:8px 0 0;
                    color:#C9AD82;
                  "
                >
                  CADMAX Consultancy Website
                </p>

              </div>

              <div
                style="
                  padding:25px;
                "
              >

                <p>
                  <strong>Name</strong>
                  <br />
                  ${fullName}
                </p>

                <p>
                  <strong>Email</strong>
                  <br />
                  ${email}
                </p>

                <p>
                  <strong>Phone</strong>
                  <br />
                  ${phone}
                </p>

                <p>
                  <strong>Project Brief</strong>
                </p>

                <div
                  style="
                    background:#F7F4ED;
                    border-left:4px solid #C9AD82;
                    padding:15px;
                    line-height:1.6;
                  "
                >
                  ${message}
                </div>

              </div>

            </div>

          </body>
        </html>
      `,
        });

        console.log(
            "✅ EMAIL SENT SUCCESSFULLY"
        );

        console.log(
            "Message ID:",
            info.messageId
        );

        return res.status(200).json({
            success: true,
            message:
                "Thank you. Your inquiry has been sent successfully.",
        });

    } catch (error) {
        console.error(
            "❌ CONTACT INQUIRY ERROR"
        );

        console.error(error);

        let message =
            "Unable to send your inquiry. Please try again.";

        // Gmail authentication error
        if (
            error?.code === "EAUTH" ||
            String(error?.message).includes("535")
        ) {
            message =
                "Email authentication failed. Please check Gmail App Password.";
        }

        return res.status(500).json({
            success: false,
            message,

            // Development me debugging ke liye
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};