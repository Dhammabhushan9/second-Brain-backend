import express from "express";
import jwt from 'jsonwebtoken'
import bcrypt, { hash } from 'bcrypt'

const saltRound=5;

const app=express();
app.use(express.json());

app.post("/api/v1/signup",async(req,res)=>{
    //zod validation 

   const InputUsername=req.body.username;
   const InputPassword= req.body.password;

   //hash password using bcrypt

   const hashPassword= await hash(InputPassword,saltRound)

   console.log("pass word is take as input");
   res.json({
    usernamw:InputUsername,
    pass:hashPassword
   })

})

app.post("/api/v1/signin",(req,res)=>{

})

app.post("/api/v1/content",(req,res)=>{

})

app.get("/api/v1/content",(req,res)=>{

})

app.delete("/api/v1/content",(req,res)=>{

})

app.post("/api/v1/brain/share",(req,res)=>{

})

app.get(" /api/v1/brain/:shareLink",(req,res)=>{
        
});


app.listen(3006,()=>{
    console.log("I'm gonna be king of the pirates!")
})