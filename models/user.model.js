const mongoose=require("mongoose");
const bcrypt=require("bcrypt")
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    generatedUrl:[
        {
            url:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Url"
            }
        }
    ]
},{timestamps:true})
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    const hashedPassword=await bcrypt.hash(this.password,10)
    this.password=hashedPassword
    return next();
})
userSchema.methods.comparePassword=async function(password)
{
    await bcrypt.compare(password,this.password)
}
const User=mongoose.model("User",userSchema)

module.exports=User