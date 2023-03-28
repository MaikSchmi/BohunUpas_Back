const router = require("express").Router();
const bcrypt = require ('bcryptjs')
const User = require('../models/User.model')
const jwt = require ('jsonwebtoken')
const isAuthenticated = require('../middlewares/jwt.middleware');

router.post("/signup", async (req, res, next) => {
    const { email, username } = req.body 
    const usernameLC = username.toLowerCase();

    try {
        const findUser = await User.find({usernameLC: usernameLC}) 
        if (findUser.length) {
            res.status(400).json({message: "Username already registered"})
            return;
        }
    } catch (error) {
        console.log(error);
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({message: "Please provide a valid email address."});
        return;
    }
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(req.body.password)) {
        res.status(400).json({message: "The password must be at least 6 (six) characters long, contain at least 1 (one) number and one lowercase and uppercase letter."});
        return;
    }
    if (req.body.password !== req.body.repeatPassword) {
        res.status(400).json({message: "The passwords do not match."});
        return;
    }

    const passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(14))
    try {
        const user = await User.create({
            email,
            username,
            usernameLC,
            passwordHash: passwordHash
        });
        const createdUser = {email: user.email, username: user.username}
        res.status(201).json({createdUser});
    } catch(error) {
        console.log(error)
        res.status(403).json({message: "Server Error or user / email already registered."})
    }
});

router.post('/login', async (req, res, next) => {
    const username = req.body.username
    try {
        const getUser = await User.find({username})
        console.log(getUser);
        if (getUser.length) {
            const passwordMatch = bcrypt.compareSync(req.body.password, getUser[0].passwordHash)
            if (passwordMatch) {
                const payload = {
                    _id: getUser[0]._id, 
                    email: getUser[0].email, 
                    username: getUser[0].username, 
                    messages: getUser[0].messages,
                    friendsList: getUser[0].friendsList
                }

                const token = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { 
                    algorithm: "HS256",
                    expiresIn: "8h"
                }) 
                res.status(200).json({token})
            } else {
                res.status(403).json({message : 'User not found or incorrect credentials.'})
            }
        } else {
            res.status(404).json({message: "User not found or incorrect credentials."})
        }
    } catch(error) {
        console.log (error)
        res.status(404).json({message: "User not found or incorrect credentials."})
    }
});

router.get('/verify', isAuthenticated, (req, res, next) => {
    if (req.payload) {
        res.json(req.payload)
    }
});

router.post("/update-token", async (req, res, next) => {
    const email = req.body.email;
    try {
        const getUser = await User.findOne({email: email})
        .populate({
            path: "friendsList",
            select: "username",
            model: "User",
        });
        if (getUser) {
            const payload = {
                _id: getUser._id, 
                email: getUser.email, 
                username: getUser.username, 
                status: getUser.status, 
                tournaments: getUser.tournaments, 
                interest: getUser.interest, 
                slogan: getUser.slogan,
                profileImage: getUser.profileImage,
                profileBackgroundImage: getUser.profileBackgroundImage,
                profileBackgroundColor: getUser.profileBackgroundColor,
                profileTextColor: getUser.profileTextColor,
                commentCount: getUser.commentCount,
                messages: getUser.messages,
                friendsList: getUser.friendsList
                }

                const token = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { 
                        algorithm: "HS256",
                        expiresIn: "8h"
                    }) 
                res.status(200).json({token})
        } else {
            res.status(403).json({message: "User not found."})
        }
    } catch (error) {
        console.log(error);
        res.status(403).json({message: "Unable to create a new token."});
    }
});

module.exports = router;