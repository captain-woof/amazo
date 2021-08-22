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
            res.status(500).json({ status: "ERROR", message: err }).end()
        }
        // Check if user exists
        User.findUserByEmail(fields.email).then((userDocs) => {
            if (userDocs) { // If user exists
                res.status(403).json({ status: "ERROR", message: "User already exists!" }).end()
            } else { // If user does not exist
                User.createNewUser(fields.name, fields.email, fields.currency, fields.password)
                    .then((result, err) => {
                        if (err) {
                            res.status(500).json(err).end()
                        } else {
                            req.session.email = fields.email
                            res.status(200).json(result).end()
                        }
                    })
            }
        }).catch((err) => {
            res.status(500).json(err).end()
        })
    })
})

// Router - Delete account
router.get("/deleteAccount", (req, res) => {
    // Check if user is logged in
    if (req.session.email) {
        User.deleteUser(req.session.email)
            .then((result) => { res.status(200).json(result).end() })
            .catch((err) => { res.status(500).json(err).end() })
    } else {
        res.status(401).json({ status: "ERROR", message: "User is not logged in!" }).end()
    }
})

// Router - Send change password request
router.get("/sendResetPassword/:email", (req, res) => {
    ChangePasswordEntry.createChangePasswordEntry(req.params.email)
        .then((result) => {
            //TODO: Send email to user
            // Email must have url "/resetPassword/EMAIL/KEY" (handled by React)
            // That page will create a POST req to "/api/resetPassword" (look at below route)


            res.status(200).json(result).end()
        })
        .catch((err) => { res.status(403).json(err).end() })
})

// Router - Change password (POST: email, key, newPassword)
router.post("/resetPassword", (req, res) => {
    var form = formidable()
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(500).json(err).end()
        } else {
            // Validate if reset password key is correct
            ChangePasswordEntry.validateChangePasswordEntry(fields.email, fields.key)
                .then((result) => {
                    // Change password
                    User.changePassword(fields.email, User.getSha3Hash(fields.newPassword))
                        .then((result) => {
                            res.status(200).json(result).end()
                        })
                })
                .catch((err) => { res.status(403).json(err).end() })
        }
    })
})

// Route - Login (POST: email, password)
router.post("/login", (req, res) => {
    // If user is already logged in, reject further login
    if (req.session.email) {
        res.status(403).json({ status: "ERROR", message: "Already logged in!" }).end()
    } else {
        // Get data from body
        var form = formidable()
        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(500).json({ status: "ERROR", message: err }).end()
            } else {
                // Check if credentials are valid
                User.checkUserCreds(fields.email, fields.password).then((result) => {
                    req.session.email = fields.email
                    res.status(200).json(result).end()
                }).catch((err) => {
                    res.status(401).json(err).end()
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
            res.status(200).json({
                status: "OK",
                message: "Logout successful!",
                redirect: "/"
            }).end()
        })
    } else { // If user isn't logged in
        res.status(403).json({
            status: "ERROR",
            message: "You are not logged in!",
            redirect: "/"
        }).end()
    }
})

// Route - Get All Currency CC
router.get("/getAllCurrencyCC", (req, res) => {
    res.status(200).send(utils.getAllCurrencyCC()).end()
})

// Route - Search Currency by CC
router.get("/searchCurrencyByCC/:cc", (req, res) => {
    var currency = utils.getCurrencyByCC(req.params.cc)
    if (currency) { // If currency exists
        res.status(200).send(currency).end()
    } else { // If currency does not exist
        res.status(404).json({
            status: "ERROR",
            message: `No currency found with CC ${req.params.cc}`
        }).end()
    }
})

// Route - Add product (POST: productUrl)
router.post("/subscribeToProduct", (req, res) => {
    if (!req.session.email) { // If user is not logged in
        res.status(401).json({ status: "ERROR", message: "You must be logged in to add product!" }).end()
        return
    }
    var form = formidable()
    form.parse(req, (err, fields, files) => {
        // Get user's currency and product ASIN
        User.findUserByEmail(req.session.email).then((currentUserDoc) => {
            if (err) {
                res.status(500).json({ status: "ERROR", message: err }).end()
            } else if (!currentUserDoc) {
                res.status(404).json({ status: "ERROR", message: "User not found!" }).end()
            } else {
                var asin = fields.productUrl.match(/\/dp\/(\w{10})/)[1]

                Product.addNewProduct(asin, currentUserDoc).then((response) => {
                    res.status(200).json(response).end()
                }).catch((err) => {
                    res.status(500).json(err).end()
                })
            }
        }).catch((err) => {
            res.status(500).json(err).end()
        })
    })
})

// Route - Unsubscribe from product (POST: productObjectIdString)
router.post("/unsubscribeToProduct", (req, res) => {
    if (!req.session.email) {
        res.status(401).json({ status: "ERROR", message: "User not logged in!" }).end()
    } else {
        var form = formidable()
        form.parse(req, (err, fields, files) => {
            mongoose.model('User')
            User.findUserByEmail(req.session.email).then((userDoc) => {
                userDoc.unsubscribeFromProduct(utils.stringToObjectId(fields.productObjectIdString))
                    .then((result) => {
                        res.status(200).json(result).end()
                    }).catch((err) => {
                        res.status(403).json(err).end()
                    })
            }).catch((err) => {
                res.status(500).json(err).end()
            })
        })
    }
})

// Route - Get All subscribed products
router.get("/getAllSubscribedProducts", (req, res) => {
    if (!req.session.email) {
        res.status(401).json({ status: "ERROR", message: "User not logged in!" }).end()
    } else {
        User.findUserByEmail(req.session.email)
            .then((userDoc) => {
                userDoc.getSubscribedProducts()
                    .then((subscribedProducts) => { res.status(200).json(subscribedProducts).end() })
                    .catch((err) => { res.status(403).json(err).end() })
            })
            .catch((err) => { res.status(403).json(err).end() })
    }
})

router.get("/isLoggedIn", (req, res) => {
    if (req.session.email) {
        res.status(200).json({ status: "OK", message: true }).end()
    } else {
        res.status(200).json({ status: "OK", message: false }).end()
    }
})

// Export
module.exports = router