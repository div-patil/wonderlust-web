const express = require("express")
const router = express.Router();
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/user.js")

router.route("/signUp")
.get(userController.signup)
.post(wrapAsync(userController.userSignup))

router.route("/login")
.get(userController.login)
.post(saveRedirectUrl,passport.authenticate("local",
    {failureRedirect :"/login",failureFlash:true}),
    userController.register
    )
// router.get("/signUp",userController.signup)
// router.get("/login",userController.login)
// router.post("/signUp",wrapAsync(userController.userSignup));
// router.post("/login",saveRedirectUrl,passport.authenticate("local",
//     {failureRedirect :"/login",failureFlash:true}),
//     userController.register
//     )
router.get("/logout",userController.logout)
module.exports = router;