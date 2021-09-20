const utils = require('../utils')
const express = require('express')
const formidable = require('formidable')
const mongoose = require('mongoose')

// Get all mongoose models
require('../models/change_password')
require("../models/user")
require("../models/product")

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
        mongoose.model('User').findUserByEmail(fields.email).then((userDocs) => {
            if (userDocs) { // If user exists
                res.status(403).json({ status: "ERROR", message: "User already exists!" }).end()
            } else { // If user does not exist
                mongoose.model('User').createNewUser(fields.name, fields.email, fields.currency, fields.password)
                    .then((result, err) => {
                        if (err) {
                            res.status(500).json(err).end()
                        } else {
                            utils.sendWelcomeEmail(fields.email, fields.name)
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
        mongoose.model('User').deleteUser(req.session.email)
            .then((result) => { res.status(200).json(result).end() })
            .catch((err) => { res.status(500).json(err).end() })
    } else {
        res.status(401).json({ status: "ERROR", message: "User is not logged in!" }).end()
    }
})

// Router - Send change password request
router.get("/sendResetPassword/:email", (req, res) => {
    mongoose.model('ChangePasswordEntry').createChangePasswordEntry(req.params.email)
        .then(({ status, email, name, key }) => {
            // If entry creation succeeds, send email to user with reset instructions
            if (status === 'OK') {
                utils.sendPasswordResetEmail(email, name, `https://brown-track.herokuapp.com/resetPassword/${email}/${key}`)
            }
            res.status(200).json({ status: "OK" }).end()
        })
        .catch((err) => { res.status(500).send(err).end() })
})

// Router - Change password (POST: email, key, newPassword)
router.post("/resetPassword", (req, res) => {
    var form = formidable()
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(500).json(err).end()
        } else {
            // Validate if reset password key is correct
            mongoose.model('ChangePasswordEntry').validateChangePasswordEntry(fields.email, fields.key)
                .then((result) => {
                    // Change password
                    mongoose.model('User').changePassword(fields.email, mongoose.model('User').getSha3Hash(fields.newPassword))
                        .then((result) => {
                            console.log(`User with email '${fields.email}' reset his/her password`)
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
                mongoose.model('User').checkUserCreds(fields.email, fields.password).then((result) => {
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
        mongoose.model('User').findUserByEmail(req.session.email).then((currentUserDoc) => {
            if (err) {
                res.status(500).json({ status: "ERROR", message: err }).end()
            } else if (!currentUserDoc) {
                res.status(404).json({ status: "ERROR", message: "User not found!" }).end()
            } else {
                var asin = fields.productUrl.match(/\/dp\/(\w{10})/)[1]
                if (!Boolean(asin)) {
                    res.status(404).json({status: "ERROR", message: "Invalid link!"}).end()
                } else {
                    mongoose.model('Product').addNewProduct(asin, currentUserDoc).then((response) => {
                        res.status(200).json(response).end()
                    }).catch((err) => {
                        res.status(500).json({status: "ERROR", message: "Could not track the product!"}).end()
                    })
                }
            }
        }).catch((err) => {
            res.status(500).json(err).end()
        })
    })
})

// Route - Unsubscribe from product (POST: productObjectIdString)
router.post("/unsubscribeToProduct", (req, res) => {
    if (!req.session.email) {
        res.status(401).json({ status: "ERROR", message: "You are not logged in!" }).end()
    } else {
        var form = formidable()
        form.parse(req, (err, fields, files) => {
            mongoose.model('User').findUserByEmail(req.session.email).then((userDoc) => {
                userDoc.unsubscribeFromProduct(fields.productObjectIdString)
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
        res.status(401).json({ status: "ERROR", message: "You are not logged in!" }).end()
    } else {
        // Get current user
        mongoose.model('User').findUserByEmail(req.session.email)
            .then((userDoc) => {
                // Get subscribed products, and resolve them
                userDoc.getSubscribedProducts()
                    .then((subscribedProducts) => {
                        res.status(200).json(subscribedProducts).end()
                    })
                    .catch((err) => { res.status(403).json({ status: "ERROR", message: err }).end() })
            })
            .catch((err) => { res.status(403).json({ status: "ERROR", message: err }).end() })
    }
})

// Route - Returns user's details
router.get("/getUserDetails", (req, res) => {
    if (!req.session.email) {
        res.status(200).json({
            name: "Visitor",
            email: null,
            currency: null,
            isLoggedIn: false
        }).end()
    } else {
        mongoose.model('User').findUserByEmail(req.session.email)
            .then((userDoc) => {
                res.status(200).json({
                    name: userDoc.name,
                    email: userDoc.email,
                    currency: utils.getCurrencyByCC(userDoc.currency),
                    isLoggedIn: true
                }).end()
            })
            .catch((err) => {
                res.status(500).json({ status: "ERROR", message: err }).end()
            })
    }
})

// Route - Changes user's details
router.post("/changeUserDetails/:fieldName", (req, res) => {
    if (!req.session.email) {
        res.status(401).json({ status: "ERROR", message: "You are not logged in!" }).end()
    } else {
        let form = formidable()
        form.parse(req, (err, fields, files) => {
            let fieldName = req.params.fieldName
            let currentPasswordHashed = mongoose.model('User').getSha3Hash(fields.currentPassword)
            let fieldText = fields.fieldText

            mongoose.model('User').findUserByEmail(req.session.email)
                .then((userDoc) => {
                    if (userDoc && userDoc.password === currentPasswordHashed) {
                        userDoc[fieldName] = fieldName !== 'password' ? fieldText : mongoose.model('User').getSha3Hash(fieldText)
                        userDoc.save()
                        res.status(200).json({ status: "OK", message: "Successfully changed user data!" }).end()
                        console.log(`User with email '${req.session.email}' changed his/her ${fieldName}`)
                    } else {
                        res.status(401).json({ status: "ERROR", message: "You've entered the wrong password!" }).end()
                    }
                })
                .catch((err) => {
                    res.status(500).json({ status: "ERROR", message: err }).end()
                })
        })
    }
})

// Route - Deletes user's account
router.post('/deleteAccount', (req, res) => {
    // Async
    (async () => {
        try {
            let userDoc = null
            let form = formidable()

            // Validate account
            if (!req.session.email) { // If user is not logged in
                res.status(401).json({ status: "ERROR", message: "You are not logged in!" }).end()
                return
            } else {  // If user is logged in
                userDoc = await mongoose.model('User').findUserByEmail(req.session.email)
                // Check if user exists
                if (!userDoc) {
                    res.status(401).json({ status: "ERROR", message: "Account does not exist!" }).end()
                    return
                }
                // Validate password
                form.parse(req, async (err, fields, files) => {
                    try {
                        if (err) {
                            throw new Error(err)
                        } else if (mongoose.model('User').getSha3Hash(fields.password) !== userDoc.password) {
                            res.status(401).json({ status: "ERROR", message: "Invalid password!" }).end()
                            return
                        }
                        // Delete all products tracked by user
                        let untrackProductObjectIds = []
                        userDoc.productsTracking.forEach((productObjectId) => {
                            untrackProductObjectIds.push(productObjectId)
                        })
                        for (let i = 0; i < untrackProductObjectIds.length; i++) {
                            try {
                                await userDoc.unsubscribeFromProduct(untrackProductObjectIds[i])
                            } catch (err) {
                                res.status(500).json({ status: "ERROR", message: err }).end()
                            }
                        }

                        // Delete account
                        await mongoose.model('User').findByIdAndDelete(userDoc._id).exec()
                        res.status(200).json({ status: "OK", message: "Account successfully deleted!" }).end()
                        return
                    } catch (err) {
                        res.status(500).json({ status: "ERROR", message: err }).end()
                    }
                })
            }
        } catch (err) {
            res.status(500).json({ status: "ERROR", message: err }).end()
            return
        }
    })()
})

// Export
module.exports = router