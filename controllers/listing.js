const Listing = require("../models/listing")
const ExpressError = require("../utils/ExpressError.js")


module.exports.index = async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("./listing/index.ejs",{allListing})
     
 }
 module.exports.newListing = (req,res)=>{
    res.render("./listing/new.ejs")
}
module.exports.searchListing = async(req,res)=>{
      const searchcountry = req.query.country;
      const allListing=await Listing.find({country:{$in:searchcountry}});
      if(allListing.length === 0)
      {
        req.flash("error","Not found")
        return res.redirect("/Listing")
      }
      res.render("./listing/search.ejs",{allListing})
   
}
module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename; 
    const newListing=new Listing( req.body.listing); 
    newListing.owner = req.user._id; 
    newListing.image={url,filename}   
    await newListing.save();
    req.flash("success","new Listing add Successfully!!");
    res.redirect("/Listing")
    

// console.log(listing)
}
module.exports.showListing=async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
       path:"reviews",
       populate:{
       path:"author",
   },
   })
    .populate("owner");
    if(!listing)
    {
       req.flash("error","Listing you request in not exit!!");
       res.redirect("/Listing")
    }
    console.log(listing)
    res.render("./listing/show.ejs",{listing});
}
module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing)
       {
             req.flash("error","Listing you request in not exit!!");
             res.redirect("/Listing")
       }
       let originalImageUrl = listing.image.url;
       originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
       res.render("./listing/edit.ejs",{listing,originalImageUrl})
}
module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename; 
    listing.image = {url,filename}
    await listing.save();
    }
    req.flash("success","Listing updated!")
    res.redirect(`/Listing/${id}`);
}
module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let deletemsg = await Listing.findByIdAndDelete(id);
    console.log(deletemsg);
    req.flash("success","delete Successfully!!");
    res.redirect("/Listing");
}