const User= require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "my_secret-key";
const saltRounds = 7;

async function handleSignUp(req, res){
    const { name, email, password, role } = req.body;
    if(!name || !email || !password || !role) return res.status(400).send("Missing required fields");
    try{
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({ 
            name,
            email,  
            password: hashedPassword,
            role
        });

        const token = jwt.sign({
                _id: user._id,
                email: user.email,
                role: user.role,
            }, JWT_SECRET);

        res.cookie("token", token);
        return res.redirect("/");
    } catch(err) {
        console.log(err);
        return res.status(500).send("An error occurred while creating the user");
    }
}

async function handleLogin(req, res){
    const { email, password, role } = req.body;
    if(!email || !password || !role) return res.status(400).send("Missing required fields");

    try{
        const user = await User.findOne({ email });
        
        if(!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if(user.role !== role) {
            return res.status(401).json({ message: "Invalid role for this user" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({
            _id: user._id,
            email: user.email,
            role: user.role,
        }, JWT_SECRET);

        return res.status(200).json({ 
            message: "Login successful",
            token 
        });
    } catch(err) {
        console.log(err);
        return res.status(500).send("An error occurred while logging in");
    }
}

module.exports = {
    handleSignUp,
    handleLogin,
};