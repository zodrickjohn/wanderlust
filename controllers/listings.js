const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new.ejs")
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
        path: "author",
       },     
    })
    .populate("owner");
    if(!listing) {
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New Listing Created !");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/Listings");
    }
    
    // Check if listing.image.url is defined and a string
    if (typeof listing.image.url !== 'string') {
        console.log('Listing image URL is not a string:', listing.image.url);
        // Handle the error or set a default value for originalImageUrl
    }

    let originalImageUrl = listing.image.url;
    console.log('Original image URL:', originalImageUrl);

    // Check if originalImageUrl is defined before calling replace
    if (originalImageUrl) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    } else {
        console.log('Original image URL is undefined');
        // Handle the error or set a default value for originalImageUrl
    }

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
     }
    req.flash("success","Listing updated !");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted !");
    res.redirect("/Listings");
};