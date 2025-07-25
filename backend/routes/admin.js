import express from "express";
import mongoose from "mongoose";
import authenticate from "../middleware/authenticate.js";
import User from "../schema/user.js";
import BankAccount from "../schema/bankAccount.js";
const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admins only" });
  }
  next();
};

router.get("/users", async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $match: { role:"user" }
      },
      {
        $lookup: {
          from: "bankaccounts", // 👈 this must match the actual collection name in MongoDB (usually lowercase + plural)
          localField: "_id",     // user._id
          foreignField: "user",  // matches bankAccount.user
          as: "bankAccounts"
        }
      }
    ]);

    return res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});


// router.get("/users", authenticate, requireAdmin, async (req, res) => {
//   try {
//     const { username, bankName, ifscCode } = req.query;

//     const pipeline = [];

//     // 1. Match users by role and optional name
//     const matchUser = { role: "user" };
//     if (username) {
//       matchUser.name = { $regex: username, $options: "i" };
//     }
//     pipeline.push({ $match: matchUser });

//     // 2. Lookup bank accounts
//     pipeline.push({
//       $lookup: {
//         from: "bankaccounts",
//         localField: "_id",
//         foreignField: "user",
//         as: "bankAccounts"
//       }
//     });

//     // 3. If filtering on bank accounts, unwind and filter
//     if (bankName || ifscCode) {
//       pipeline.push({ $unwind: "$bankAccounts" });

//       const matchBank = {};
//       if (bankName) {
//         matchBank["bankAccounts.bankName"] = { $regex: bankName, $options: "i" };
//       }
//       if (ifscCode) {
//         matchBank["bankAccounts.ifscCode"] = { $regex: ifscCode, $options: "i" };
//       }

//       pipeline.push({ $match: matchBank });

//       // 4. Regroup users with their matched bank accounts
//       pipeline.push({
//         $group: {
//           _id: "$_id",
//           name: { $first: "$name" },
//           email: { $first: "$email" },
//           role: { $first: "$role" },
//           bankAccounts: { $push: "$bankAccounts" }
//         }
//       });
//     }

//     const users = await User.aggregate(pipeline);
//     return res.status(200).json({ users });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Server error" });
//   }
// });





export default router;
