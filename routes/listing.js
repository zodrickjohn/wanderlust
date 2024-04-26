const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router
    .route("/")
    .get( wrapAsync(listingController.index)) //index route
    .post( isLoggedIn,        
           upload.single("listing[image]"),
           validateListing, 
           wrapAsync(listingController.createListing) //create route
    );

//new route
router.get("/new",
           isLoggedIn,
           listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) //show route
    .put(  //update route
        isLoggedIn,
        isOwner, 
        upload.single("listing[image]"),
        validateListing, 
    wrapAsync(listingController.updateListing))
    .delete(  //delete
        isLoggedIn,
        isOwner, 
        wrapAsync(listingController.destroyListing));

//edit rote
router.get("/:id/edit",
            isLoggedIn,
            isOwner, 
            wrapAsync(listingController.renderEditForm));

module.exports = router;