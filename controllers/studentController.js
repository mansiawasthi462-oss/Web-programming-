const mongoose = require("mongoose");
const Student = require("../models/Student");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleError = (res, err) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.code === 11000) {
    return res
      .status(409)
      .json({ success: false, message: "A student with this email already exists" });
  }
  return res.status(500).json({ success: false, message: err.message });
};

// CREATE  POST /api/students
exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    handleError(res, err);
  }
};

// READ ALL  GET /api/students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (err) {
    handleError(res, err);
  }
};

// READ ONE  GET /api/students/:id
exports.getStudentById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid student id" });
    }
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, data: student });
  } catch (err) {
    handleError(res, err);
  }
};

// UPDATE  PUT /api/students/:id
exports.updateStudent = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid student id" });
    }
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, data: student });
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE  DELETE /api/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid student id" });
    }
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, message: "Student deleted", data: student });
  } catch (err) {
    handleError(res, err);
  }
};
