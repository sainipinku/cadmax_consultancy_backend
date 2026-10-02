export const inquiryEmailTemplate = ({
    fullName,
    email,
    phone,
    message,
}) => {
    return `
    <!DOCTYPE html>
    <html>
      <body style="
        margin:0;
        padding:0;
        background:#f5f5f5;
        font-family:Arial,sans-serif;
      ">

        <div style="
          max-width:650px;
          margin:30px auto;
          background:#ffffff;
          border-radius:10px;
          overflow:hidden;
          border:1px solid #e5e5e5;
        ">

          <div style="
            background:#24211D;
            padding:25px 30px;
            color:#ffffff;
          ">
            <h2 style="margin:0;">
              New Project Inquiry
            </h2>

            <p style="
              margin:8px 0 0;
              color:#C9AD82;
            ">
              CADMAX Consultancy
            </p>
          </div>

          <div style="padding:30px;">

            <p>
              <strong>Name:</strong><br/>
              ${fullName}
            </p>

            <p>
              <strong>Email:</strong><br/>
              ${email}
            </p>

            <p>
              <strong>Phone:</strong><br/>
              ${phone}
            </p>

            <p>
              <strong>Project Brief:</strong>
            </p>

            <div style="
              background:#f7f4ed;
              border-left:4px solid #C9AD82;
              padding:15px;
              line-height:1.6;
            ">
              ${message}
            </div>

          </div>
        </div>

      </body>
    </html>
  `;
};