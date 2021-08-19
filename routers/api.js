const express = require('express')
const User = require('../models/user')
const Product = require('../models/product')
const formidable = require('formidable')
const utils = require('../utils')
const mongoose = require('mongoose')
const ChangePasswordEntry = require('../models/change_password')

// Router for all api
const router = express.Router()

// Route - Registration (POST: password,name,email,currency)
router.post("/register", (req, res) => {
    // Get data from POST body
    var form = formidable()
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.json({ status: "ERROR", message: err }).end()
        }
        // Check if user exists
        User.findUserByEmail(fields.email).then((userDocs) => {
            if (userDocs) { // If user exists
                res.json({ status: "ERROR", message: "User already exists!" }).status(403).end()
            } else { // If user does not exist
                User.createNewUser(fields.name, fields.email, fields.currency, fields.password)
                    .then((result, err) => {
                        if (err) {
                            res.json(err).status(500).end()
                        } else {
                            res.json(result).status(200).end()
                        }
                    })
            }
        }).catch((err) => {
            res.json(err).status(500).end()
        })
    })
})

// Router - Delete account
router.get("/deleteAccount", (req, res) => {
    // Check if user is logged in
    if (req.session.email) {
        User.deleteUser(req.session.email)
            .then((result) => { res.json(result).status(200).end() })
            .catch((err) => { res.json(err).status(500).end() })
    } else {
        res.json({ status: "ERROR", message: "User is not logged in!" }).status(401).end()
    }
})

// Router - Send change password request
router.get("/sendResetPassword/:email", (req, res) => {
    ChangePasswordEntry.createChangePasswordEntry(req.params.email)
        .then((result) => {
            //TODO: Send email to user
            // Email must have url "/resetPassword/EMAIL/KEY" (handled by React)
            // That page will create a POST req to "/api/resetPassword" (look at below route)


            res.json(result).status(200).end()
        })
        .catch((err) => { res.json(err).status(403).end() })
})

// Router - Change password (POST: email, key, newPassword)
router.post("/resetPassword", (req, res) => {
    var form = formidable()
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.json(err).status(500).end()
        } else {
            // Validate if reset password key is correct
            ChangePasswordEntry.validateChangePasswordEntry(fields.email, fields.key)
                .then((result) => {
                    // Change password
                    User.changePassword(fields.email, utils.getHash(fields.newPassword))
                        .then((result) => {
                            res.json(result).status(200).end()
                        })
                })
                .catch((err) => { res.json(err).status(403).end() })
        }
    })
})

// Route - Login (POST: email, password)
router.post("/login", (req, res) => {
    // If user is already logged in, reject further login
    if (req.session.email) {
        res.json({ status: "ERROR", message: "Already logged in!" }).status(403).end()
    } else {
        // Get data from body
        var form = formidable()
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.json({ status: "ERROR", message: err }).status(500).end()
            } else {
                // Check if credentials are valid
                User.checkUserCreds(fields.email, fields.password).then((result) => {
                    req.session.email = fields.email
                    res.json(result).status(200).end()
                }).catch((err) => {
                    res.json(err).status(500).end()
                })
            }
        })
    }
})

// Route - Logout
router.get("/logout", (req, res) => {
    if (req.session.email) { // If user is logged in
        var email = req.session.email
        req.session.destroy(() => {
            console.log(`User with email '${email}' logged out`)
            res.json({ status: "OK", message: "Logout successful!" }).status(200).end()
        })
    } else { // If user isn't logged in
        res.json({ status: "ERROR", message: "User not logged in!" }).status(403).end()
    }
})

// Route - Get All Currency CC
router.get("/getAllCurrencyCC", (req, res) => {
    res.send(utils.getAllCurrencyCC()).status(200).end()
})

// Route - Search Currency by CC
router.get("/searchCurrencyByCC/:cc", (req, res) => {
    var currency = utils.getCurrencyByCC(req.params.cc)
    if (currency) { // If currency exists
        res.send(currency).status(200).end()
    } else { // If currency does not exist
        res.json({
            status: "ERROR",
            message: `No currency found with CC ${req.params.cc}`
        }).status(404).end()
    }
})

// Route - Add product (POST: productUrl)
router.post("/subscribeToProduct", (req, res) => {
    if (!req.session.email) { // If user is not logged in
        res.json({ status: "ERROR", message: "You must be logged in to add product!" }).status(401).end()
        return
    }
    var form = formidable()
    form.parse(req, (err, fields, files) => {
        // Get user's currency and product ASIN
        User.findUserByEmail(req.session.email).then((currentUserDoc) => {
            if (err) {
                res.json({ status: "ERROR", message: err }).status(500).end()
            } else if (!currentUserDoc) {
                res.json({ status: "ERROR", message: "User not found!" }).status(404).end()
            } else {
                var asin = fields.productUrl.match(/\/dp\/(\w{10})/)[1]

                Product.addNewProduct(asin, currentUserDoc).then((response) => {
                    res.json(response).status(200).end()
                }).catch((err) => {
                    res.json(err).status(500).end()
                })
            }
        }).catch((err) => {
            res.json(err).status(500).end()
        })
    })
})

// Route - Unsubscribe from product (POST: productObjectIdString)
router.post("/unsubscribeToProduct", (req, res) => {
    if (!req.session.email) {
        res.json({ status: "ERROR", message: "User not logged in!" }).status(401).end()
    } else {
        var form = formidable()
        form.parse(req, (err, fields, files) => {
            mongoose.model('User')
            User.findUserByEmail(req.session.email).then((userDoc) => {
                userDoc.unsubscribeFromProduct(utils.stringToObjectId(fields.productObjectIdString))
                    .then((result) => {
                        res.json(result).status(200).end()
                    }).catch((err) => {
                        res.json(err).status(403).end()
                    })
            }).catch((err) => {
                res.json(err).status(500).end()
            })
        })
    }
})

// Route - Get All subscribed products
router.get("/getAllSubscribedProducts", (req, res) => {
    if (!req.session.email) {
        res.json({ status: "ERROR", message: "User not logged in!" }).status(401).end()
    } else {
        User.findUserByEmail(req.session.email)
            .then((userDoc) => {
                userDoc.getSubscribedProducts()
                    .then((subscribedProducts) => { res.json(subscribedProducts).status(200).end() })
                    .catch((err) => { res.json(err).status(403).end() })
            })
            .catch((err) => { res.json(err).status(403).end() })
    }
})

// Export
module.exports = router