const express = require('express');
const fetchuser = require('../middlewares/fetchuser');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Note = require('../models/Note');

// ROUTE1: Get all notes of user using GET: "api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try {
        // Fetch all the notes of logged in user using its id
        const notes = await Note.find({user: req.user.id});
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occurred");
    }
})

// ROUTE2: Add notes to user using POST: "api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
     body('title', 'Title should be atleast 3 characters').isLength({ min: 3 }),
     body('description', 'Description should be atleast 5 characters').isLength({ min: 5 })
], async (req, res)=>{

    // If there are errors return Bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Get title , description , & tag from the request body
        const { title, description, tag } = req.body;

        // Create a new note
        const notes = new Note(
            {
                title, description, tag, user: req.user.id
            }
        )

        // Save the Note
        const notesSaved = await notes.save();
        res.json(notesSaved);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occurred");
    }
})

// ROUTE3: Update existing notes using PUT: "api/notes/updatenote/:id". Login required
router.put('/updatenote/:id', fetchuser, async (req, res)=>{
    try {
        const { title, description, tag } = req.body;

        // Create a new Note object
        const newNote = {};
        if(title){newNote['title'] = title}
        if(description){newNote['description'] = description}
        if(tag){newNote['tag'] = tag}

         // Find the note and update it 
        let note = await Note.findById(req.params.id);

        // Check if the note of given id exists
        if(!note){
            return res.status(404).json({error: "Not Found"})
        }

        // Check if the logged in user is updating his own notes and not others
        if(note.user.toString() !== req.user.id){
            return res.status(401).json({error: "Not Allowed"})
        }

        // If passes the above validations update the note
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.json({note});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occurred");
    }
})

// ROUTE4: Delete existing note using DELETE: "api/notes/deletenote/:id". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res)=>{
    try {

         // Find the note and delete it 
        let note = await Note.findById(req.params.id);

        // Check if the note of given id exists
        if(!note){
            return res.status(404).json({error: "Not Found"})
        }

        // Check if the logged in user is deleting his own notes and not others
        if(note.user.toString() !== req.user.id){
            return res.status(401).json({error: "Not Allowed"})
        }

        // If passes the above validations delete the note
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"Success" : "Note has been deleted", note: note});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occurred");
    }
})

module.exports = router