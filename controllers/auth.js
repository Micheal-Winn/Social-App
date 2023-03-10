import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


//Register User

export const register = async(req,res)=>{
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password : passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewProfile: Math.floor(Math.random() * 10000),
            impressions : Math.floor(Math.random() * 10000),
        })

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({error : err.message});
        //res.status(400).send({message: "Invalid User"});
    }
}

//LOGGING IN USER
export const login = async (req,res)=> {
    try {
        const {email,password} = req.body;
        console.log("email",email)
        const user = await User.findOne({email : email});

        if(!user) return res.status(400).json({message : "User does not exists."});

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) 
        {
            return res.status(400).json({message : "Invalid credentials."})
        };

        const token = jwt.sign({id: user._id }, process.env.JWT_SECRECT)
        delete user.password;//because returned user is containg password so i delete it but it has been still in database and doesn't get sent back to the frontend 
        res.status(200).json({token,user})
    } catch (err) {
        res.status(400).json({error : err.message}); 
    }

    
}
