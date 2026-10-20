import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    first_name:          { type: String, required: true, trim: true },
    last_name:           { type: String, required: true, trim: true },
    phone:               { type: String, required: true, unique: true, trim: true },
    role:                { type: String, enum: ["guest", "admin"], default: "guest" },
    email:               { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:            { type: String, required: true },
    national_id:         { type: String, required: true, unique: true, trim: true },
    nationalIdImageLink: { type: String },
    avatar:              { type: String },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
