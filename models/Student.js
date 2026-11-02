const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    age: { type: Number, min: [1, "Age must be positive"], max: 120 },
    course: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
