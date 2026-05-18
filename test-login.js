import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./src/models/Admin.model.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/cadmax";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB");
    console.log(
      "Database name:",
      mongoose.connection.db.databaseName
    );

    console.log(
      "JWT_SECRET:",
      process.env.JWT_SECRET
    );

    console.log(
      `\n--- Step 1: Finding admin with email ${ADMIN_EMAIL} ---`
    );

    const admin = await Admin.findOne({
      email: ADMIN_EMAIL,
    });

    if (!admin) {
      console.log(
        `❌ Admin not found with email: ${ADMIN_EMAIL}`
      );

      const all = await Admin.find({});

      console.log("\nAll admins in DB:");

      all.forEach((a) =>
        console.log(`- ${a.email} (${a._id})`)
      );

      await mongoose.connection.close();

      process.exit(1);
    }

    console.log("✅ Admin found!");

    console.log("  _id:", admin._id);
    console.log("  email:", admin.email);
    console.log("  password hash:", admin.password);

    console.log(
      `\n--- Step 2: Comparing password '${ADMIN_PASSWORD}' ---`
    );

    const isMatch = await bcrypt.compare(
      ADMIN_PASSWORD,
      admin.password
    );

    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log(
        "\n❌ Password does NOT match! Re-hashing..."
      );

      const newHash = await bcrypt.hash(
        ADMIN_PASSWORD,
        10
      );

      console.log("New hash:", newHash);

      admin.password = newHash;

      await admin.save();

      console.log("✅ Password saved to DB");

      const verify = await bcrypt.compare(
        ADMIN_PASSWORD,
        newHash
      );

      console.log("Re-verification:", verify);
    }

    console.log("\n--- Final Result ---");

    const finalAdmin = await Admin.findOne({
      email: ADMIN_EMAIL,
    });

    const finalCheck = await bcrypt.compare(
      ADMIN_PASSWORD,
      finalAdmin.password
    );

    console.log("Admin in DB:", finalAdmin.email);

    console.log(
      `Password validation against '${ADMIN_PASSWORD}':`,
      finalCheck
    );

    if (finalCheck) {
      console.log("\n✅✅✅ LOGIN SHOULD WORK NOW! ✅✅✅");

      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Password: ${ADMIN_PASSWORD}`);
    } else {
      console.log(
        "\n❌❌❌ Still failing! Check bcrypt/hash logic."
      );
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

run();