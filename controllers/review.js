const Listing = require("../models/review")
const Review = require("../models/listing")
module.exports.createReview = async(req,res)=>{
    // console.log(req.params.id)
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    console.log(newReview)
    newReview.author = req.user._id;
    console.log(listing.reviews)
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","review create Successfully!!");
    res.redirect(`/Listing/${listing._id}`);
}
module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
   
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review delete Successfully!!");
    res.redirect(`/Listing/${id}`)

}