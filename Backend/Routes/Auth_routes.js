const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup',async (req,res)=>{
    try {
        const { name, email, password } = req.body;
        const exist = await User.findOne({ email });
        if (exist) return res.status(400).json({ message: 'User already exists' });
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
    
        await newUser.save();
        res.status(201).json({ message: 'User created' });
      } catch (err) {
        res.status(500).json({ message: 'Signup failed', error: err });
      }
    
});

router.post('/login', async(req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
        const token = jwt.sign({ userId: user._id ,role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ token, user: { name: user.name, email: user.email ,role:user.role,id:user._id} });
      } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err });
      }
    
});
router.get('/',(req,res)=>{
    res.send("hello");
});

module.exports = router;
