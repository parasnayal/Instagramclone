const express = require("express");
const router = express.Router();
const user = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const {JWT_SECRET} = require("../config/keys")

// 1=> route for creating user
router.post("/signup", [
    body('email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { pic } = req.body
        let User = await user.findOne({ email: req.body.email })
        if (User) {
            return res.status(400).json({ error: "Sorry user with this email already exists" });
        }
        const genSalt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, genSalt);
        User = await user.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
            pic
        })

        const payload = {
            user: {
                id: User.id
            }
        }
        const TOKEN = jwt.sign(payload, JWT_SECRET);
        const { email, name, id,followers,following } = User;
        res.json({ TOKEN, user: { email, name, id,followers,following, pic } });
    } catch (error) {
        return res.status(500).json({ error });
    }
})
router.post("/login", [
    body('email').isEmail(),
    body('password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const User = await user.findOne({ email });
        if (!User) {
            return res.status(400).json({ error: "Please! login with correct credentials" });
        }
        const comparePassword = bcrypt.compare(password, User.password);
        if (!comparePassword) {
            return res.status(400).json({ error: "Please login with correct credentials" });
        }
        const payload = {
            user: {
                id: User.id
            }
        }
        const TOKEN = jwt.sign(payload, JWT_SECRET);
        const { name, id, followers, following, pic } = User;
        res.json({ TOKEN, user: { email, name, id, followers, following, pic } })
    } catch (error) {
        return res.status(500).json({ error });
    }
})
module.exports = router;