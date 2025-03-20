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
image: {type : String, require : false,default : "role.png"},

//etat: Boolean
count : {type : Number, default:'0'},
formations : [{type : mongoose.Schema.Types.ObjectId,ref:'Formation'}],//ONE TO MANY

//formation : {type : mongoose.Schema.Types.ObjectId,ref:'Formation'}//ONE TO one
//etat: Boolean,
//ban:Boolean,
},
{timestamps: true}
);
userSchema.pre("save", async function(next){
    try{
        const salt = await bcrypt.genSalt();
        const user = this;// this hya data w data par defaut user
        user.password = await bcrypt.hash(user.password,salt)
        user.etat = false ;
        user.ban = true ;
        user.count = user.count + 1
        next();

    } catch (error) {
        next(error);
    }
})
userSchema.post("save", async function(req,res,next) {
    console.log("new user was created & saved successfully");
    next();
});
//authentifier
userSchema.statics.login= async function (email,password) {
    //console.log(email, password);
        const user = await this.findOne({email});
      //console.log(user)
        if(user){
            const auth = await bcrypt.compare(password, user.password);
        //console.log(auth)
            if(auth){
                //if(user.etat == true) {
                    //ban hya tblokilk idha fama condition
                   // if(user.ban == false){
                        
                            return user ;
                       // } else{
                        //throw new Error("ban");
                    //}   
                    //}else{
                     //   throw new Error("compte desactive");
                    //}
            }else{
                throw new Error("Password invalid");
            }
        }else{
            throw new Error ("Email not found");
        }
    
};
const User = mongoose.model("User", userSchema);
module.exports = User;

