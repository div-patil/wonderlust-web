if(process.env.NODE_ENV != "production")
{
    require('dotenv').config()
}

const express = require('express');
const methodOverride = require('method-override')
const app = express();
const mongoose = require('mongoose');
const ExpressError = require("./utils/ExpressError.js")
const path = require("path");
const ejsMate = require("ejs-mate")
const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const flash = require("connect-flash")
const session = require("express-session")
const mongoStore = require("connect-mongo")
const passport = require("passport")
const User = require("./models/user.js")
const LocalStrategy = require("passport-local")
const bodyParser = require("body-parser");
const MongoStore = require('connect-mongo');

app.use(bodyParser.urlencoded({extended:true}))
app.engine('ejs',ejsMate)
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,"/public")))
// database

const atlas_url=process.env.ATLASDB_URL;
main().then((res)=>{
    console.log("connected db");
})
.catch((err)=>
{
   console.log(err)
})

async function main() {
    await mongoose.connect(atlas_url);
}

const store = MongoStore.create({
    mongoUrl:atlas_url,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24 * 3600,
})
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly:true
    },
}



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    
    res.locals.success = req.flash("success");
    
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/Listing",listingsRouter);
app.use("/Listing/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// all route
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});
app.use((err,req,res,next)=>{
    let {statuscode=500,message="something went wrong"} = err;
    res.status(statuscode).render("error.ejs",{message})
    // res.status(statuscode).send(message);
});
app.listen(8080,()=>{
    console.log("starting server 8080..........")
});