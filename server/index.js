const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { v4: uuid } = require('uuid');
const Note = require('../models/note');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// get all notes
app.get('/api/notes', async (req, res, next) => {
  try {
    const allNotes = await Note.find({});
    res.json(allNotes);
  } catch (error) {
    next(error);
  }
});

// get one note
app.get('/api/notes/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const foundNote = await Note.findById(id);
    res.json(foundNote);
  } catch (error) {
    next(error);
  }
});

// delete note
app.delete('/api/notes/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    await Note.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// create note
app.post('/api/notes', async (req, res, next) => {
  const body = req.body;

  const note = new Note({
    id: uuid(),
    content: body.content,
    date: new Date(),
    important: body.important || false,
  });

  try {
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (error) {
    next(error);
  }
});

// update note
app.put('/api/notes/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const note = await Note.findById(id);
    note.content = body.content || note.content;
    if (typeof body.important === 'boolean') {
      note.important = body.important;
    }
    note.save();
    res.status(204).end();
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: 'could not update note' });
  }
});

// 404 handler
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// error handler
const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  // return res.status(500).send({ error: 'something went wrong' });
  next(error);
};

app.use(errorHandler);
