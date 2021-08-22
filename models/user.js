const mongoose = require('mongoose')
const utils = require('../utils')
const Product = require('./product')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    currency: { type: String, required: true },
    password: { type: String, required: true },
    productsTracking: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
})

userSchema.methods.subscribeToProduct = function (productObjectId, asin) {
    // Add product to current User ONLY if it does not exist
    if (!this.productsTracking.find((productId) => { return productId.equals(productObjectId) })) {
        this.productsTracking.push(productObjectId)
        this.save()
        console.log(`User with email '${this.email}' subscribed to ASIN '${asin}'`)
        return { status: "OK", message: `Successfully subscribed to ASIN ${asin}` }
    } else {
        return { status: "ERROR", message: "User already subscribed to the product!" }
    }
}

userSchema.statics.findUserByEmail = function (email) {
    return new Promise((resolve, reject) => {
        User.findOne({ email: email }, (err, userDoc) => {
            if (err) {
                console.log(err)
                reject({ status: "ERROR", message: err })
            } else {
                resolve(userDoc)
            }
        })
    })
}

userSchema.statics.createNewUser = function (name, email, currency, password) {
    return new Promise((resolve, reject) => {
        var newUser = new User({
            name: name,
            email: email,
            currency: currency,
            password: User.getSha3Hash(password)
        })
        newUser.save((err) => {
            if (err) {
                console.log(err)
                reject({ status: "ERROR", message: err })
            } else {
                console.log(`New user signed up with email: ${email}`)
                resolve({
                    status: "OK",
                    message: "You've successfully signed-up!",
                    redirect: "/dashboard"
                })
            }
        })
    })
}

userSchema.statics.checkUserCreds = function (email, password) {
    return new Promise((resolve, reject) => {
        User.findOne({
            $and: [{ email: email }, { password: User.getSha3Hash(password) }]
        }, (err, userDoc) => {
            if (err) {
                reject({ status: "ERROR", message: err })
            } else if (userDoc) { // If valid credential
                console.log(`User with email '${email}' logged in`)
                resolve({ status: "OK", message: "Login successful!", redirect: "/dashboard" })
            } else { // If invalid credential
                reject({ status: "ERROR", message: "Wrong email/password!" })
            }
        })
    })
}

userSchema.statics.isAnyUserSubscribedToProductUnderCurrency = function (productObjectId, currencyCC) {
    return new Promise((resolve, reject) => {
        User.findOne({
            $and: [{ productsTracking: productObjectId }, { currency: currencyCC }]
        }, (err, userDoc) => {
            if (err) {
                reject({ status: "ERROR", message: err })
            }
            else if (userDoc) { // If there is at least one user found
                resolve(true)
            } else { // If there is no user found
                resolve(false)
            }
        })
    })
}

userSchema.methods.unsubscribeFromProduct = function (productObjectId) {
    return new Promise((resolve, reject) => {
        console.log(this.productsTracking)
        console.log(productObjectId)
        if (this.productsTracking.indexOf(productObjectId) !== -1) { // If user is subscribed to the product
            this.productsTracking.pull(productObjectId)
            this.save((err) => {
                if (err) {
                    reject({ status: "ERROR", message: err })
                } else {
                    // Clean up
                    Product.removeUnsubscribedProduct(productObjectId, this.currency).then((result) => {
                        resolve({ status: "OK", message: "Successfully unsubscribed from product!" })
                    }).catch((err) => {
                        reject(err)
                    })
                }
            })
        } else { // If user is not subscribed to product
            reject({ status: "ERROR", message: "User is not subscribed to product!" })
        }
    })
}

userSchema.statics.deleteUser = function (email) {
    return new Promise((resolve, reject) => {
        User.deleteOne({ email: email }, (err) => {
            if (err) {
                reject({ status: "ERROR", message: err })
            } else {
                resolve({ status: "OK", message: "User account deleted!" })
            }
        })
    })
}

userSchema.statics.changePassword = function (email, newPasswordHash) {
    return new Promise((resolve, reject) => {
        User.updateOne({ email: email }, { password: newPasswordHash }, () => {
            resolve({ status: "OK", message: "Successfully changed password" })
        })
    })
}

userSchema.methods.getSubscribedProducts = function () {
    return new Promise((resolve, reject) => {
        var subscribedProducts = []
        var findProductPromises = []
        this.productsTracking.forEach((productObjectId) => {
            findProductPromises.push(Product.findProductByObjectId(productObjectId))
        })
        Promise.all(findProductPromises)
            .then((allProducts) => {
                allProducts.forEach((productDoc) => {
                    subscribedProducts.push(
                        (productDoc.prices.find((priceEle) => {
                            return priceEle.currency_cc === this.currency
                        })).price)
                })
                resolve(subscribedProducts)
            })
            .catch((err) => { reject(err) })
    })
}

userSchema.statics.getSha3Hash = (password) => {
    return crypto.createHash('sha3-512').update(password).digest('hex')
}

const User = mongoose.model("User", userSchema, 'users')

module.exports = User