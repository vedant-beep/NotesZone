import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext'

const NoteItem = (props) => {
  const context = useContext(noteContext);
  const {deleteNote} = context;
  const { note, openModal } = props;
  return (
    <div className="col-md-3 my-3">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">
            {note.description}
          </p>
          <button type='button' className="btn btn-sm btn-danger mx-2" onClick={()=>{
            deleteNote(note._id);
            props.showAlert("Deleted the note successfully", "success")
          }}>
            Delete <i className="fa-solid fa-trash-can"></i>
          </button>
          <button type='button' className="btn btn-sm btn-primary mx-2" onClick={()=>{
            openModal(note)
          }}>
            Edit <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
