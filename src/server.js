
import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";
import { verifyMailConnection } from "./services/mailService.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Database connection
    await connectDB();

    // Check Nodemailer / SMTP connection
    await verifyMailConnection();

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();