import './App.css';
import Note from './components/Note';
import React, { useState, useEffect } from 'react';
import getNotes from './api/notesAPI';
import axios from 'axios';
import { NOTEURL } from './constants/constant';
import Notification from './components/Notification';

const App = () => {
  const [notes, setNotes] = useState();
  const [showImportant, setShowImportant] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const notesToShow = showImportan
    ? notes.filter((note) => note.important)
    : filteredNotes
    ? filteredNotes
    : notes;

  const populateNotes = async () => {
    const notesReceived = await getNotes();
    setNotes(notesReceived.data);
  };

  const addNote = async (e) => {
    e.preventDefault();
    const note = {
      content: e.target.content.value,
      important: e.target.important.checked,
    };
    try {
      await axios.post(NOTEURL, note);
      populateNotes();
      setFilteredNotes(null);
    } catch (error) {
      console.log(error);
      handleError('Server is not responding, please try again later');
    }
    e.target.content.value = '';
    e.target.important.checked = false;
  };

  const searchNotes = (e) => {
    e.preventDefault();
    const search = e.target.value.toLowerCase();
    const newNotes = notes.filter((note) =>
      note.content.toLowerCase().includes(search),
    );
    setFilteredNotes(newNotes);
  };

  const toggleImportance = async (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };
    try {
      await axios.put(`${NOTEURL}/${id}`, changedNote);
      populateNotes();
    } catch (error) {
      console.log(error);
      handleError('Server is not responding, please try again later');
    }
  };

  const handleError = (text) => {
    setErrorMessage(text);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  useEffect(() => {
    populateNotes();
  }, []);
  return (
    <div>
      <Notification message={errorMessage} />
      <h2>Search</h2>
      <input type="text" name="search" onChange={searchNotes} />
      <label htmlFor="important">
        Show important notes
        <input
          type="checkbox"
          name="important"
          onChange={() => setShowImportant(!showImportant)}
        />
      </label>
      <h2>Notes</h2>
      <ul>
        {notesToShow ? (
          notesToShow.map((note) => (
            <Note
              key={note.id}
              note={note}
              toggleImportance={toggleImportance}
            />
          ))
        ) : (
          <div>Loading...</div>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input type="text" name="content" />
        <label htmlFor="important">
          {' '}
          important
          <input type="checkbox" name="important" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
