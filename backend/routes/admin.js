import express from "express";
import User from "../schema/user.js";
import BankAccount from "../schema/bankAccount.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const { username, bankName, ifscCode } = req.query;

    const pipeline = [];

    const matchUser = { role: "user" };
    if (username) {
      matchUser.username = { $regex: username, $options: "i" };
    }
    pipeline.push({ $match: matchUser });

    pipeline.push({
      $lookup: {
        from: "bankaccounts", 
        localField: "_id",
        foreignField: "user",
        as: "bankAccounts"
      }
    });

    if (bankName || ifscCode) {
      pipeline.push({ $unwind: "$bankAccounts" });

      const matchBank = {};
      if (bankName) {
        matchBank["bankAccounts.bankName"] = { $regex: bankName, $options: "i" };
      }
      if (ifscCode) {
        matchBank["bankAccounts.ifscCode"] = { $regex: ifscCode, $options: "i" };
      }

      pipeline.push({ $match: matchBank });

      pipeline.push({
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          role: { $first: "$role" },
          bankAccounts: { $push: "$bankAccounts" }
        }
      });
    }

    const users = await User.aggregate(pipeline);
    return res.status(200).json({ users });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
