import mongoose from "mongoose";

const Schema =mongoose.Schema;
const ObjectId=Schema.ObjectId;

const User= new Schema({
    
    username:{type:String},
    password:{type:String}

})

const Content =new Schema({
    link:{type:String},
    type:{type:String,enum}, 
    title:{type:String},
    tag:{type:String},
    userId:{type:String,ObjectId,ref:User}
 
})

const Tag= new Schema({
    title:{type:String}
})

const Link= new Schema({
    hash:{type:String},
    userId:{}
})