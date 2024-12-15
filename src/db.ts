import mongoose, { Types } from "mongoose";

const Schema =mongoose.Schema;
const ObjectId=Schema.ObjectId;

// mongoose connection 
try {
     mongoose.connect("mongodb+srv://cob56dhammabhushanwaghmare:omtNTxv1bOtWqTmD@cluster0.jtu0y.mongodb.net/second_brain");
     console.log("data base connrction  succesfull");
} catch (error) {
    console.log("error in connection to data base")
}

const User= new Schema({
    
    username:{
    type:String ,
    require:true,
    unique:true,
    minLength:[3,"username should be minimum 3 character"],
    maxLength:[10,"username should be less than 10 character"]
},
    password:{
        type:String,
        require:true,
        minLength:[8,"passwaord should be minimum should be 8 characters"],
        maxLength:[20,"maximum length od password should be w0 character"]
    }

})

const contentType=['image,post,video']// content should be incerase

const Content =new Schema({
    link:{
        type:String,
        require:true
    },
    type:{
        type:String,enum:contentType,
        require:true
     }, 
    title:{
        type:String,
        require:true
    },
    tag:{
        type:Types.ObjectId,
         ref:'Tag',
    },

    userId:{
        type:Types.ObjectId,
        ref:'User',
        }
        
 
})

const Tag= new Schema({
    title:{
        type:String,
        require:true
    }
})

const Link= new Schema({
    hash:{type:String},
    userId:{
        type: Types.ObjectId,
        ref:'User'
    } 
})


export const UserModel=mongoose.model('users',User);
export const ContentModel=mongoose.model('contents',Content);
export const TagModel= mongoose.model("tags",Tag);
export const LinkModel=mongoose.model("links",Link);
/*
module.exports={
    UserModel,
    ContentModel,
    TagModel,
    LinkModel
}
*/