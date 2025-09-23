const express = require('express');
const userRouter=express.Router()
const app=express()
const User=require("../models/user.model")
const jwt=require("jsonwebtoken");
const cookieParser = require('cookie-parser');
app.use(cookieParser())
userRouter.post("/newuser",async(req,res)=>{
    const {email,password}=req.body
    try {
        const newUser=await User.create({
            email:email,
            password:password,
            generatedUrl:[]   
        })
        const token=jwt.sign(
            {
            email:newUser.email
        },"SECRET")
        res.cookie("token",token)
        res.render("home",{signedIn:newUser})
    } catch (error) {
        res.render("signup",{errType:"User Already Exist"})
    }
    
})
userRouter.get("/showDashboard",async(req,res)=>{
    const token=req.cookies.token
    const decode=jwt.verify(token,"SECRET")
    const loggedInUser=await User.findOne({email:decode.email}).populate({
        path:"generatedUrl.url",model:"Url"
    })
    res.render("dashboard",{signedIn:loggedInUser})
})
userRouter.post("/verifyUser",async(req,res)=>{
    const {email,password}=req.body
    try {
        const founded=await User.findOne({email:email,password:password})
        if(!founded.comparePassword(password))
            {
                res.render("login",{errType:"INVALID USER OR PASSWORD"})
            }
            if(founded)
            {  
            const token=jwt.sign({
                email:founded.email
            },"SECRET")
            res.cookie("token",token);
                res.render("home",{signedIn:founded})
            }
            else{
                res.render("login",{errType:"INVALID USER OR PASSWORD"})
            }
    } catch (error) {
        res.render("login",{errType:"INVALID USER OR PASSWORD"})
    }
    
})
userRouter.get("/logout",(req,res)=>{
    res.clearCookie("token");
    res.render("home")
})
module.exports=userRouter