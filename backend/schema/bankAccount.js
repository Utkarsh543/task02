import mongoose from "mongoose";


const bankAccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ifscCode: {
        type: String,
        required: true
    },
    branchName: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: Number,
        required: true
    },
    accountHolderName: {
        type: String,
        required: true
    }

})

const BankAccount = mongoose.model("BankAccount",bankAccountSchema);
export default BankAccount;