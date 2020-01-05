const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

router.get("/add", (req, res) => {
  res.render("notes/add-note");
});

router.post("/new-note", async (req, res) => {
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
    await newNote.save();
    res.redirect("/notes/notes");
  }
});

router.get("/notes", async (req, res) => {
  const notes = await Note.find().sort({ date: "desc" });
  res.render("notes/all-notes", { notes });
});

router.get("/notes/edit/:id", async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);
  res.render("notes/edit-note", { note });
});

router.put("/notes/edit-note/:id", async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);
  res.render("notes/edit-note", { note });
});

router.put("/edit-note/:id", async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(id, { title, description });
  res.redirect("/notes/notes");
});

router.delete("/notes/delete/:id", async (req, res) => {
  const { id } = req.params;
  await Note.findByIdAndDelete(id);
  res.redirect("/notes/notes");
});

module.exports = router;
