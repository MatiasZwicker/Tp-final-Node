import { mongoose } from "mongoose";
const userSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
  },
});

export const User = mongoose.model("User", userSchema);
