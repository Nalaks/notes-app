const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

// get all notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// get one note
app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).send({ error: "this note doesn't exist" });
  }
});

// delete note
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

// create note
app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    id: uuid(),
    content: body.content,
    date: new Date(),
    important: body.important || false,
  };
  notes.push(note);
  res.json(note);
});

// update note
app.put("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const note = notes.find((note) => note.id === id);

  if (note) {
    note.content = body.content || note.content;
    if (typeof body.important === "boolean") {
      note.important = body.important;
    }
    res.json(note);
  } else {
    res.status(404).end();
  }
});

// 404 handler
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
