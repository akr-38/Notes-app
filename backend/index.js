import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import {User} from './models/user.model.js'
import jwt from 'jsonwebtoken';
import {authenticateToken} from './utilities.js'
import {Note} from "./models/note.model.js"
import bcrypt from 'bcrypt'

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("mongodb connected");
})
.catch((err)=>{
    console.log('error connecting to mongodb:', err.message);
})

app.use(express.json())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.get('/',(req,res)=>{
    res.json({data:"hello"});
})

//create account
app.post('/create-account',async(req,res)=>{
    
    const {fullName, email, password} = req.body

    if(!fullName){
        return res.status(400).json({error: true, message: 'Full Name is required'});
    }

    if(!email){
        return res.status(400).json({error: true, message: 'Email is required'})
    }

    if(!password){
        return res.status(400).json({error: true, message: 'Password is required'})
    }

    const isUser = await User.findOne({email: email});

    if(isUser){
        return res.json({error: true, message: 'User already exists'})
    }

    const encryptedPassword = await bcrypt.hash(password, 10)
    
    const user = new User({
        fullName,
        email,
        password: encryptedPassword
    });

    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    return res.json({
        error: false,
        user,
        accessToken,
        message: 'Registration Successful'
    })
})

//login
app.post('/login',async(req,res)=>{
    
    const {email, password} = req.body;

    if(!email){
        return res.status(400).json({message: 'Email is required'});
    }

    if(!password){
        return res.status(400).json({message: 'Password is required'});
    }

    const userInfo = await User.findOne({ email: email });

    if(!userInfo){
        return res.status(400).json({ message: 'User not Found' })
    }

    if(userInfo.email == email && await bcrypt.compare(password, userInfo.password)){
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        
        return res.json({
            error: false, 
            message: 'Login Successful',
            email,
            accessToken,
        });
    }
    else{
        return res.status(400).json({
            error: true,
            message: 'Invalid Credentials',
        })
    }
})

//get-user
app.get('/get-user', authenticateToken, async(req, res)=>{
    const {user} = req.user;

    const isUser = await User.findOne({_id: user._id});

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn
        },
        message: ''
    })
})

//add-note
app.post('/add-note', authenticateToken, async(req,res)=>{
    const {title, content, tags} = req.body;
    const {user} = req.user;
    
    if(!title){
        return res.status(400).json({error: true, message: 'Title is required'});
    }

    if(!content){
        return res.status(400).json({error: true, message: 'Content is required'});
    }

    try{
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await note.save();

        return res.status(200).json({
            error: false,
            note,
            message:'Note added successfully'
        });
    }
    catch (error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        })
    }
})

//edit-note
app.put('/edit-note/:noteId', authenticateToken, async(req, res)=>{
    
    const noteId = req.params.noteId; 
    const {title, content, tags, isPinned} = req.body;
    const {user} = req.user;

    if(!title && !content && !tags){
        return res.status(400).json({error: true, message: 'No changes provided'})
    }

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});

        if(!note){
            return res.status(404).json({error: true, message: 'Note not found'})
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Note updated successfully',
        })
    }catch(error){
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error'
        })
    }
})

//get-all-notes
app.get('/get-all-notes', authenticateToken, async(req, res)=>{
    const {user} = req.user;

    try{
        const notes = await Note.find({ userId:user._id }).sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: 'All notes retrived successfully'
        })
    }catch(error){
        return res.status(500).json({
            error: true,
            message : 'Internal server Error'
        })
    }
})

//delete-note
app.delete('/delete-note/:noteId', authenticateToken, async(req, res)=>{
    const noteId = req.params.noteId
    const {user} = req.user

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});

        if(!note){
            return res.status(404).json({error:true ,message: "note not found"})
        }

        await Note.deleteOne({_id: noteId, userId: user._id});

        return res.json({
            error: false,
            message: 'Note deleted successfully'
        })
    }catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

//update isPinned
app.put("/update-note-pinned/:noteId", authenticateToken, async(req, res)=>{
    const noteId = req.params.noteId; 
    const {isPinned} = req.body;
    const {user} = req.user;

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});

        if(!note){
            return res.status(404).json({error: true, message: 'Note not found'})
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: 'Note updated successfully',
        });
    }catch(error){
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error'
        });
    }
})

//search-notes
app.get('/search-notes/', authenticateToken, async(req,res)=>{

    const {user} = req.user
    const {query} = req.query

    if(!query){
        return res.status(400).json({error: true, message: 'Search query is missing'})
    }

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                {title: { $regex: new RegExp(query, 'i') }},
                {content: { $regex: new RegExp(query, 'i') }},
            ],
        })

        return res.json({error: false, notes: matchingNotes, message: 'notes matching the search query retrieved successfully'})
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }
})

// app.listen(process.env.PORT, ()=>{
//     console.log(`server is running at ${process.env.PORT  || 8000}`);
// });

export default app;
