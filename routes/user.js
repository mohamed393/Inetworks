//Here we want to make registeration API//
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const authmiddleware = require('../middleware/authmiddleware');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // this if condition to sure that the email will not repeated again//
        let newUser = await User.findOne({ email: req.body.email })
        if (newUser) {
            res.status(400).send({ message: 'User Already Exists' })
        } else {
            newUser = new User({
                name: req.body.name
                , email: req.body.email
                , password: req.body.password
                , isAdmin: req.body.isAdmin
                , isSuperAdmin: req.body.isSuperAdmin
            });
            //here we want to encode password before save the document//
            const hashedPassword = await bcrypt.hash(newUser.password, 10);
            newUser.password = hashedPassword
            const savedUser = await newUser.save();
            // after save the user we want to give him the token //
            const token = newUser.genToken();
            // here we give the user his token  in header or as a response//
            res.header('x-auth-token', token).send(token)
        }
    } catch (error) {
        console.log(error.message)
    }

});



module.exports = router