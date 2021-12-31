import React from 'react';

const Note = ({ note, toggleImportance }) => {
  return (
    <>
      <li className="note">{note.content}</li>
      <label htmlFor="importantNote">important?</label>
      <input
        type="checkbox"
        name="importantNote"
        onChange={() => toggleImportance(note.id)}
        checked={note.important}
      />
    </>
  );
};

export default Note;
