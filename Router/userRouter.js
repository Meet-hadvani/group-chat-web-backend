const router = require('express').Router();
const Users = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../Middlewares/checkAuth')

//create new account for user
router.post('/signup', async (req, res) => {

    //check if user is exist or not
    let existingUser = await Users.find({ email: req.body.email });

    try {

        if (existingUser.length != 0 && existingUser[0].email == req.body.email) {
            return res.status(200).json({ message: "This email is already in use" })
        }

        //hash password before save into database
        let hashedPassword = await bcrypt.hash(req.body.password, 10);

        //create new user object
        let newUser = new Users({
            email: req.body.email,
            password: hashedPassword,
        })

        //post data in database
        let newCreatedUser = await newUser.save();

        //Create new JWT token 
        let email = newCreatedUser.email;
        let id = newCreatedUser._id;

        const token = jwt.sign({
            email, id
        }, process.env.JWT_KEY, {
            expiresIn: 72000000
        })

        return res.json({
            status: "success",
            code: 200,
            message: "Welcome to online group chat.",
            results: {
                u_id: newCreatedUser._id,
                email: newCreatedUser.email,
                token: token
            }
        })
    } catch (err) {
        console.log(err)
        res.status(400).json("Something went wrong !")
    }
})

//Login user
router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {

        let user = await Users.findOne({ email: email });

        if (!user) {
            return res.json({
                status: "failed",
                code: 401,
                message: "User not found."
            })
        }

        let isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({
                status: "failed",
                code: 401,
                message: "Invalid credentials please try again."
            })
        }

        let id = user.id;

        //Create new JWT token 
        const token = jwt.sign({
            email, id
        }, process.env.JWT_KEY, {
            expiresIn: 72000000
        })

        return res.json({
            status: "success",
            code: 200,
            message: "Welcome to online group chat.",
            results: {
                token: token,
                u_id: user._id,
                email: user.email
            }
        })
    } catch (err) {
        console.log(err)
        res.json({
            status: "failed",
            code: 400,
            message: "Something went wrong !",
        })
    }
})


module.exports = router;