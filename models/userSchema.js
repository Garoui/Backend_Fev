const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
nom: {
    type : String,
     required : false,
     unique: true,
    },
prenom:{
    type : String,
     required : false,
    },
email: {
    type : String,
     required : true,
      unique : true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],

    },
password: {
    type : String, 
    required :true,
    minLength:8,
    match:[
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
],
},
role:{
    type:String,
    enum : ["Admin", "Etudiant", "Formateur"],
},
image: {type : String, require : false,default : "Etudiant.png"},

//etat: Boolean
count : {type : Number, default:'0'},
formations : [{type : mongoose.Schema.Types.ObjectId,ref:'Formation'}],//ONE TO MANY
//formation : {type : mongoose.Schema.Types.ObjectId,ref:'Formation'}//ONE TO one

},
{timestamps: true}
);
userSchema.pre("save", async function(next){
    try{
        const salt = await bcrypt.genSalt();
        const user = this;// this hya data w data par defaut user
        user.password = await bcrypt.hash(user.password,salt)
        //user.etat = false ;
        user.count = user.count + 1
        next();

    } catch (error) {
        next(error);
    }
})
userSchema.post("save", async function(req,res,next) {
    console.log("new user was created & saved successfully");
    next();
})
const User = mongoose.model("User", userSchema);
module.exports = User;