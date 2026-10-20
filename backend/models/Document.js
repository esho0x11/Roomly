import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    front:   { type: String, required: true },
    back:    { type: String, required: true },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
