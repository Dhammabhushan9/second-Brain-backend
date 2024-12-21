import express from "express";
import jwt from 'jsonwebtoken'
import bcrypt, { hash } from 'bcrypt'
import {z} from 'zod'
import { ContentModel, LinkModel, UserModel } from "./db";
import mongoose from "mongoose";
import  {userMiddleware}  from "./middelware";
import { hashLink } from "./utils";
import cors from 'cors';


//credential  
const saltRound=5;
const JWT_PASSWORD="iamgonabehokage";

const app=express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup",async(req,res):Promise<any>=>{

    
    

   const InputUsername=req.body.username;
   const InputPassword= req.body.password;

   console.log(InputUsername)
   //zod validation 
    const UserSchema=z.object({
        username:z.string(),
        password:z.string()
    })

    // validate the input

     const parsUser=UserSchema.safeParse({
        username:InputUsername,
        password:InputPassword
     })

     // cheching if valid or not

     if(!parsUser.success){
        console.log("validation error",parsUser.error.issues);

        return res.status(400).json({
            error:parsUser.error.issues
        })
     }


   //hash password using bcrypt
  try{
    const hashPassword= await hash(InputPassword,saltRound)
    //code for the add user in the data base
 
    await UserModel.create({
        username:InputUsername,
        password:hashPassword
    });

      res.json({
        message:"user sussefuly login in the data base "
    })

  }catch(err){
    return res.json({
        err:err
    })
  }
   

})

app.post("/api/v1/signin",async(req,res):Promise<any>=>{

    // input parameters
    const InputUsername=req.body.username;
    const InputPassword= req.body.password;
 
    console.log(InputUsername)
    //zod validation 
     const UserSchema=z.object({
         username:z.string(),
         password:z.string()
     })
 
     // validate the input
 
      const parsUser=UserSchema.safeParse({
         username:InputUsername,
         password:InputPassword
      })
 
      // cheching if valid or not
 
      if(!parsUser.success){
         console.log("validation error",parsUser.error.issues);
 
         return res.status(400).json({
             error:parsUser.error.issues
         })
      }
 
       // find user in the data base

    const findUserDatabase= await UserModel.findOne({
        username:InputUsername
    })
   
    if (findUserDatabase === null) {
       return res.status(403).json({
            message:"use not found"
        })
    }
    
    // Ensure InputPassword is a string
    if (typeof InputPassword !== 'string') {
      
        res.status(403).json({
            message:"Invalid password input"
        })
    }
    
    // checking the password

    const isValidUser = await bcrypt.compare(InputPassword,findUserDatabase.password!);

    //assigning the jwt token to the user
    if(isValidUser){
        const token=jwt.sign({
            id: findUserDatabase._id
        },JWT_PASSWORD);

        res.json({
            token:token
        })
    }else{
        res.status(403).json({
            message:"incorrect credentials"
        })
    }

})
//@ts-ignore
app.post("/api/v1/content", userMiddleware,async(req,res)=> {
  const InputLink=req.body.link;
  const InputType=req.body.type;
  const InputTitle=req.body.title
  //zod input validation


  //adding content in the data model
        console.log("/api/v1/content hi")
 await ContentModel.create({
            link: InputLink,
            type: InputType, 
            title: InputTitle,
            tag: [],
            //@ts-ignore
            userId: req.userId
    })
    res.json({
        message:"content is suceesfuly added in data base"
    })

})
//@ts-ignore
app.get("/api/v1/content",userMiddleware,async(req,res)=>{
            //@ts-ignore
         const InputuserId=req.userId

         const UserContent= await ContentModel.find({
            userId:InputuserId
         }).populate("userId","username")

         res.json({
            content:UserContent
         })
})

//delete the content on the data base
      //@ts-ignore
app.delete("/api/v1/content",userMiddleware,async(req,res)=>{

    const InputContentId=req.body.contentId;

    await ContentModel.deleteMany({
        //@ts-ignore
        userId:req.userId

    })

    res.json({
        message:"content deleted succefully"
    })

})
//@ts-ignore
app.post("/api/v1/brain/share",userMiddleware,async(req,res)=>{

        const share=req.body.share;
        //@ts-ignore
        const userId=req.userId
        const hashTempt = share ? hashLink(20) : null;

        if(share){
        await LinkModel.create({
                hash:hashTempt,
                userId:userId,
            })

            res.json({
                link:`/api/v1/brain/${hashTempt}`,
                message :"update link is sharable "
            })
        }else{
         const l=  await LinkModel.findOneAndDelete({
            userId:userId,
            })
            res.json({
            L:l,
                message :"update link is deactivate "
            })
        }

     
})

app.get("/api/v1/brain/:shareLink",async(req,res):Promise<any>=>{
  
        const hash= req.params.shareLink;
        console.log(hash);
        // find the link in the Link model


        if(hash){
         const Link= await LinkModel.findOne({
                hash:hash
            })
            console.log("LINK DONE")
            console.log(Link)
            // if link is not valid
            if(!Link){
                return ( res.status(404).json({
                        error:"Invalid link"
            }))
        
            }
        
        //find the content of the user we have found
        const Content=await ContentModel.findOne({
            userId:Link.userId
        })
        console.log("content done")
        console.log(Content)
        // find the infromation about the user

        const user=await UserModel.findOne({
            _id:Link.userId
        })
        console.log("userdone")
        console.log(user)
        // return the sheard link content 

        res.json({
            username:user?.username,
            linkContent:Content
        })


        }else{
            res.status(411).json({
                message:"Pleas provide the link"
            })
        }


});


app.listen(3006,()=>{
    console.log("I'm gonna be king of the pirates!")
})
