import Admin from "../../models/Admin.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken.js";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(admin._id);

  res.json({
    success: true,
    token,
    admin: {
      id: admin._id,
      email: admin.email,
    },
  });
};
