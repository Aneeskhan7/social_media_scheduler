import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Password rules:
 * - At least 8 characters
 * - One lowercase letter
 * - One uppercase letter
 * - One number
 */
const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// =======================
// REGISTER USER
// =======================
export const registerUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    // 🧼 Input type validation
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid input type" });
    }

    // Normalize input
    email = email.trim().toLowerCase();
    password = password.trim();

    // Required fields check
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔐 Password strength check
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, and a number"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// =======================
// LOGIN USER
// =======================
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    // 🧼 Input type validation
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid input type" });
    }

    // Normalize input
    email = email.trim().toLowerCase();
    password = password.trim();

    // Required fields check
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email: email.trim() }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
