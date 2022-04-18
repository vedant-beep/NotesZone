import { useState } from "react";
import NoteContext from "./noteContext";
const NoteState = (props) => {
const notesInitial = [];
const [notes, setNotes] = useState(notesInitial);
const host = 'http://localhost:5000';

  // Get all Notes 
  const getNotes = async () =>{
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'auth-token': localStorage.getItem('token')
      }
    });
    const json = await response.json();
    setNotes(json);
  }

  // Add Note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({title: title, description: description, tag: tag})
    });
    const json = await response.json();
    setNotes(notes.concat(json));
  };

  // Delete Note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    });
    const json = await response.json();
    console.log(json);
    const newNote = notes.filter((note)=>{
      return note._id !== id;
    })
    setNotes(newNote);
  };

  // Edit Note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({title: title, description: description, tag: tag})
    });
    const json = await response.json();
    console.log(json);
    let index = notes.findIndex((element)=> element._id === id);
    let newNotes = notes;
    newNotes[index].title = title;
    newNotes[index].description = description;
    newNotes[index].tag = tag;
    setNotes(newNotes);
    getNotes();
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
