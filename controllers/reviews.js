const Listing = require("../models/listing");
const Review = require("../models/review");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports.createReview = async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review (req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","Review Added !");
    res.redirect('/listings/'+ listing._id);
};

module.exports.destroyReview = async (req,res) => {
    let {id, reviewId} = req.params;
    id = new ObjectId(id); // Use the new keyword to create a new instance of ObjectId
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted !");
    res.redirect(`/listings/${id}`);
};