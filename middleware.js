const Listing = require("./models/listing")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require('./schema.js');
const flash = require("connect-flash");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated())
        {
            console.log(req.originalUrl)
            req.session.redirectUrl = req.originalUrl;
            req.flash("error","You must be loggin before creating a listing")
            return res.redirect("/login")
        }
        next();
}
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.currUser._id))
        {
           req.flash("error","You don't have permission to edit!!");
           return res.redirect(`/Listing/${id}`);
        }
        next();
}
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    // console.log(error)
    if(error)
    {
        console.log("error")
        let errormsg = error.details.map((el)=>el.message).join(",");
        console.log(errormsg)
        throw new ExpressError(400,errormsg);
    }
    else{
        next();
    }
}
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    // console.log(error)
    if(error)
    {
        console.log("error")
        let errormsg = error.details.map((el)=>el.message).join(",");
        console.log(errormsg)
        throw new ExpressError(400,errormsg);
    }
    else{
        next();
    }
}
module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id))
    {
           req.flash("error","You don't have permission to modify!!");
           return res.redirect(`/Listing/${id}`);
    }
        next();
}