import mongoose from "mongoose";

const SavingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    savingType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Saving || mongoose.model("Saving", SavingSchema);
