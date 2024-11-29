const User = require("../models/user")
module.exports.signup=(req,res)=>{
    res.render("users/signUp.ejs")
}
module.exports.login = (req,res)=>{
    res.render("users/login.ejs")
}
module.exports.userSignup = async(req,res)=>{
    try{
        console.log("kkkkk")
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registerUser = await User.register(newUser,password)
        console.log(registerUser)
        req.login(registerUser,(err)=>{
            if(err)
            {
                return next(err)
            }
            req.flash("success","Welcome to wonderlust!");
            res.redirect("/Listing")
        })
        
    }
    catch(err)
    {
        req.flash("error",err.message)
        res.redirect("/signUp")
    }
}
module.exports.register = async(req,res)=>{
    
    req.flash("success","Welcome back to wonderlust!");
    let redirectUrl = res.locals.redirectUrl || "/Listing";
    res.redirect(redirectUrl);
}
module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        return next(err);
    })
    req.flash("success","You are logout successfully!!..");
    res.redirect("/Listing")
}