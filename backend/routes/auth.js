const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middlewares/fetchuser');

// Secret signature for sending jwt token
const JWT_SECRET = "Brockl#F5";

// ROUTE1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
     body('email', 'Please enter a valid Email').isEmail(),
     body('name', 'Name should be atleast 3 characters').isLength({ min: 3 }),
     body('password', 'Password should be atleast 5 characters').isLength({ min: 5 })],
async (req, res)=>{
    let success = false;
    // If there are errors return Bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
        // Check whether the user with this email already exists
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({success, error: "Email already exists!"});
        }

        // Adding salt and hashing the password
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // If user does not exists then create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        // Payload string given in auth Token 
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET); // Synchronously giving authToken
        success = true;
        // Sending auth token after registering the user
        res.json({success, authToken});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occurred");
    }
    // console.log(req.body);
})


// ROUTE2: Authenticate a User logging using: POST "/api/auth/login". No login required
router.post('/login', [body('email', 'Please enter a valid Email').isEmail(),
     body('password', 'Password should not be empty').exists()],
async (req, res)=>{
    let success = false;

    // If there are errors return Bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });

    }

    const { email, password } = req.body;
    try {
        // Check whether the user with this email exists
        let user = await User.findOne({email: email});

        // if the user does not exist return bad request and errors
        if(!user){
            return res.status(400).json({success, error: "Please login with correct credentials"});
        }

        // if password does not match return bad request and erros
        let passwordCheck = await bcrypt.compare(password, user.password);
        if(!passwordCheck){
            return res.status(400).json({success, error: "Please login with correct credentials"});
        }

        // Payload string given in auth Token 
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET); // Synchronously giving authToken
        success = true;
        // Sending auth token after authenticating the user
        res.json({success, authToken});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occurred");
    }
    // console.log(req.body);
})

// ROUTE3: Get logged in user using POST: "api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    }  catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occurred");
    }
})

module.exports = router