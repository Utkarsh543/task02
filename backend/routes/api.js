import express from "express";
import { z } from "zod";
import BankAccount from "../schema/bankAccount.js";
import authenticate from "../middleware/authenticate.js";
const router = express.Router();

const bankDetailsSchema = z.object({
  ifscCode: z
    .string()
    .min(10)
    .max(10),

  branchName: z
    .string()
    .min(2, { message: "Branch name must be at least 2 characters long" })
    .max(100),

  bankName: z
    .string()
    .min(2, { message: "Bank name must be at least 2 characters long" })
    .max(100),

  accountNumber: z
    .string()
    .min(9)
    .max(18)
});

router.post("/addAccount", authenticate, async (req, res) => {
  const { ifscCode, branchName, bankName, accountNumber } = req.body;
  const user = req.user;

  const validatedData = bankDetailsSchema.safeParse({
    ifscCode,
    branchName,
    bankName,
    accountNumber,
  });

  if (!validatedData.success) {
    return res.status(400).json({ error: validatedData.error.flatten() });
  }

  const newBankDetails = await BankAccount.create({
    ifscCode: validatedData.data.ifscCode,
    bankName: validatedData.data.bankName,
    branchName: validatedData.data.branchName,
    accountNumber: validatedData.data.accountNumber,
    accountHolderName: user.username,
    user: user.userId,
  });

  return res.status(200).json({ newBankDetails });
});

router.get("/accounts", authenticate, async (req, res) => {
  const userId = req.user.userId;
  const accounts = await BankAccount.find({ user: userId });

  if (!accounts) {
    return res.status(404).json({ error: "No accounts found" });
  }

  return res.status(200).json({ accounts });
});


const partialBankDetailsSchema = bankDetailsSchema.partial();

// PATCH: Edit bank account by ID
router.patch("/updateAccount/:id", authenticate, async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  const validation = partialBankDetailsSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.flatten() });
  }

  const updated = await BankAccount.findOneAndUpdate(
    { _id: id, user: user.userId },
    validation.data,
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ error: "Bank account not found" });
  }

  return res.status(200).json({ updated });
});


// DELETE: Remove a bank account by ID
router.delete("/deleteAccount/:id", authenticate, async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  const deleted = await BankAccount.findOneAndDelete({ _id: id, user: user.userId });

  if (!deleted) {
    return res.status(404).json({ error: "Bank account not found" });
  }

  return res.status(200).json({ message: "Bank account deleted", deleted });
});


export default router;
