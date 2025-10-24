const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

main().then(()=>{console.log("Connected to DB");})
.catch((err)=>{console.log(err);})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/JugaaduStay');
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("set up is done...");
})

//index route
app.get("/listings",async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

//new route--->get a form for new listing
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
})

app.post("/listings",async(req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//update route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

// app.get("/listing", async(req,res)=>{
//     let sampleList = new Listing({
//         title : "Stars Villa",
//         description : "It's a place where peace exist, you can relax here.",
//         price : 1000,
//         location : "Space",
//         country : "May Sky",
//     });
//     await sampleList.save();
//     console.log("document added to collection");
//     res.send("Successfull");
// })

app.listen(port,()=>{
    console.log("Server listen to port 8080");
})