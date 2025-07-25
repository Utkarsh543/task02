import express from "express";
import cors from "cors";
import connectDB from "./db/config.js";
import adminRoutes from "./routes/admin.js";
import apiRoutes from "./routes/api.js";
import { loginSchema, signupSchema } from "./types/index.js";
import User from "./schema/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express()

app.use(cors());
app.use(express.json())

connectDB()

app.use("/api/",apiRoutes);
app.use("/admin",adminRoutes);
const JWT_SECRET ="secret";

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  const validatedData = loginSchema.safeParse({ email, password });
  if (!validatedData.success) {
    return res.status(400).json({
      error: validatedData.error.flatten(),
    });
  }

  // Check if user exists
  const user = await User.findOne({ email: validatedData.data.email });
  if (!user) {
    return res.status(404).json({ error: "No user with this email" });
  }

  // Check password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role:user.role
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    message: "Login successful",
    token
  });
});

app.post("/signup",async(req,res)=>{
    const {username ,email, password} = req.body;
    const validatedData = signupSchema.safeParse({
        username,email,password
    })
    if(!validatedData.success){
        return res.status(400).json({
            error:validatedData.error.flatten()
        })
    }
    const hashedPassword = await bcrypt.hash(password,5);
    const newUser = await User.create({
        username:validatedData.data.username,
        email:validatedData.data.email,
        password:hashedPassword
    })
    return res.status(200).json({newUser})
})
app.listen(3000,()=>{
    console.log("server is listening on port 3000");
})