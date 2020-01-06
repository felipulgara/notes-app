const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { isAuthenticated } = require("../helpers/auth");

router.get("/add", isAuthenticated, (req, res) => {
  res.render("notes/add-note");
});

router.post("/new-note", isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({ text: "Please write a title" });
  }
  if (!description) {
    errors.push({ text: "Please write a description" });
  }
  if (errors.length > 0) {
    res.render("notes/add-note", {
      errors,
      title,
      description
    });
  } else {
    const newNote = new Note({ title, description });
    newNote.user = req.user.id;
    await newNote.save();
    req.flash("success_msg", "Note added successfully");
    res.redirect("/notes/notes");
  }
});

router.get("/notes", isAuthenticated, async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ date: "desc" });
  res.render("notes/all-notes", { notes });
});

router.get("/notes/edit/:id", async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);
  res.render("notes/edit-note", { note });
});

router.put("/edit-note/:id", isAuthenticated, async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(id, { title, description });
  req.flash("success_msg", "Note updated successfully");
  res.redirect("/notes/notes");
});

router.delete("/notes/delete/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  await Note.findByIdAndDelete(id);
  req.flash("success_msg", "Note deleted successfully");
  res.redirect("/notes/notes");
});

module.exports = router;
