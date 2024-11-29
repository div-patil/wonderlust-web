const mongoose = require('mongoose');
const initdata = require("./data.js");
const Listing = require("../models/listing.js")

let mongo_url = 'mongodb://127.0.0.1:27017/wonderlust';
main().then((res)=>{
    console.log("connected db");
})
.catch((err)=>
{
   console.log(err)
})

async function main() {
    await mongoose.connect(mongo_url)
    
}
const initDB = async ()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>
        ({...obj,owner:"66e81b32815f3ac80970b880",
    }));
    console.log(initdata.data.owner)
    await Listing.insertMany(initdata.data);
    console.log("data was initailze");
}
initDB();