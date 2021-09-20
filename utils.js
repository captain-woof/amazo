const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Product = require('./models/product')
const User = require('./models/user')
const ChangePasswordEntry = require('./models/change_password')
const crypto = require('crypto')
const nodemailer = require("nodemailer")
const dotenv = require('dotenv')

// Setting up env vars
dotenv.config()

//// VARS
// For currencies
const currencies = JSON.parse(fs.readFileSync(path.join(__dirname, "currencies.json").toString()))
// For email templates
const welcomeEmail = fs.readFileSync(path.join(__dirname, 'email_templates', 'welcome.html')).toString()
const passwordResetEmail = fs.readFileSync(path.join(__dirname, 'email_templates', 'forgot_password.html')).toString()
const productMinPriceNotifEmail = fs.readFileSync(path.join(__dirname, 'email_templates', 'lowest_price.html')).toString()

// For email bot
let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_BOT_USERNAME, // email account username
        pass: process.env.MAIL_BOT_PASS // email account password
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1'
    }
});


// FUNCTIONS
const sendWelcomeEmail = (email, name) => {
    transporter.sendMail({
        from: `"Brown-Track" <${process.env.MAIL_BOT_USERNAME}>`,
        to: email,
        subject: 'Welcome to Brown-Track!',
        html: welcomeEmail.replace('NAME', name)
    }, (err, info) => {
        if (err) {
            console.log(`Mail Bot Error: ${err}`)
        } else {
            console.log(`Welcome email sent to '${email}'`)
        }
    })
}

const sendPasswordResetEmail = (email, name, url) => {
    transporter.sendMail({
        from: `"Brown-Track" <${process.env.MAIL_BOT_USERNAME}>`,
        to: email,
        subject: 'Password Reset Instructions for Brown-Track',
        html: passwordResetEmail.replace('NAME', name).replace('LINK', url).replace('LINK', url)
    }, (err, info) => {
        if (err) {
            console.log(`Mail Bot Error: ${err}`)
        } else {
            console.log(`Password reset email sent to '${email}'`)
        }
    })
}

const sendProductMinPriceNotifMail = ({email, name, cc, productTitle, productMinPrice, productThumbnail, productLink}) => {
    transporter.sendMail({
        from: `"Brown-Track" <${process.env.MAIL_BOT_USERNAME}>`,
        to: email,
        subject: "Lowest price spotted!",
        html: productMinPriceNotifEmail.replace('NAME', name).replace('PRODUCT_THUMBNAIL', productThumbnail).replace('PRODUCT_NAME', productTitle).replace('PRODUCT_NAME', productTitle).replace('CC', cc).replace('PRODUCT_PRICE', productMinPrice).replace('PRODUCT_URL', productLink)
    }, (err, info) => {
        if (err) {
            console.log(`Mail Bot Error: ${err}`)
        } else {
            console.log(`Minimum price notification email sent to '${email}'`)
        }
    })
}


const getCurrencyByCC = (cc) => {
    return currencies.find((currency) => { return currency.cc == cc })
}

const getAllCurrencyCC = () => {
    return currencies
}

const removeInArray = (arr, ele) => {
    var indexToRemoveAt = arr.indexOf(ele)
    if (indexToRemoveAt !== -1) {
        arr.splice(indexToRemoveAt, 1)
        return true
    } else {
        return false
    }
}

const stringToObjectId = (objectIdStr) => {
    return mongoose.Types.ObjectId(objectIdStr)
}

const objectIdToString = (objectId) => {
    return objectId.toString()
}

const getRandomHexString = (len) => {
    return crypto.randomBytes(len / 2).toString('hex')
}

const collectAllProductPrices = () => {
    Product.collectAllProductPrices()
        .then((result) => { console.log(result.message) })
        .catch((err) => { console.log(err.message) })
}

const removeExpiredPasswordResetData = async () => {
    // Get unix time (ms) of 10 mins ago
    let earliestValidTimestamp = (new Date(Date.now() - 10 * 60 * 1000)).getTime() // 10 minutes ago

    // Find all reset password entries
    let allEntries = await ChangePasswordEntry.find({})

    // Iterate over all entries, collect expired ones
    let expiredEntries = []
    allEntries.forEach((entry) => {
        if (entry.timestamp.getTime() < earliestValidTimestamp) {
            expiredEntries.push(entry)
        }
    })

    // Now delete all expired entries
    if (expiredEntries.length !== 0) {
        console.log(`Removing ${expiredEntries.length} expired password-reset entries`)
        expiredEntries.forEach(async (entry) => {
            ChangePasswordEntry.findByIdAndDelete(entry._id).exec()
        })
    }
}

const findMinInArray = (priceEle) => {
    try {
        let result = Infinity
        priceEle.forEach((p) => { if (p.price !== 0 && p.price < result) { result = p.price } })
        return result
    } catch (err) {
        console.log(err)
    }
}

const searchAndNotifyProductsWithMinPriceToday = async () => {
    let allProducts = await Product.find({}).exec()
    let productsToNotifyAbout = [] // Each elem is {cc: '', minPrice: , title: '', thumbnail: '', productObjectId: '', url: ''}
    let lastElement = null

    // Collect all products that need notifying customers about
    allProducts.forEach((productDoc) => {
        productDoc.prices.forEach((pricesEle) => {
            lastElement = (pricesEle.price[pricesEle.price.length - 1]).price
            if(lastElement === findMinInArray(pricesEle.price)){
                productsToNotifyAbout.push({cc: pricesEle.currency_cc, minPrice: lastElement, title: productDoc.title, thumbnail: productDoc.thumbnail, productObjectId: productDoc._id, url: productDoc.url})
            }
        })
    })

    // Now make a list of all users
    // Iterate over each elem in `productsToNotifyAbout`, for each, search which users are tracking
    // the product with the `productObjectId` and `cc`
    let allUsers = await User.find({}).exec()
    let usersToNotify = [] // Each elem looks like {email: '', name: '', cc: '', productTitle: '', productMinPrice: '', productThumbnail: '', productLink: ''}

    productsToNotifyAbout.forEach((productToNotifyAbout) => {
        allUsers.forEach((userDoc) => {
            // If users cc matches and user tracks the productObjectId, add to notify list
            if(userDoc.currency === productToNotifyAbout.cc && userDoc.productsTracking.indexOf(productToNotifyAbout.productObjectId) !== -1){
                usersToNotify.push({email: userDoc.email, name: userDoc.name, cc: productToNotifyAbout.cc, productTitle: productToNotifyAbout.title, productMinPrice: productToNotifyAbout.minPrice, productThumbnail: productToNotifyAbout.thumbnail, productLink: productToNotifyAbout.url})
            }
        })
    })

    // Now mail to each user who needs to be notified
    usersToNotify.forEach((userToNotify) => {
        sendProductMinPriceNotifMail(userToNotify)
    })
}

module.exports = {
    getCurrencyByCC: getCurrencyByCC,
    getAllCurrencyCC: getAllCurrencyCC,
    removeInArray: removeInArray,
    stringToObjectId: stringToObjectId,
    objectIdToString: objectIdToString,
    getRandomHexString: getRandomHexString,
    collectAllProductPrices: collectAllProductPrices,
    sendWelcomeEmail: sendWelcomeEmail,
    sendPasswordResetEmail: sendPasswordResetEmail,
    removeExpiredPasswordResetData: removeExpiredPasswordResetData,
    searchAndNotifyProductsWithMinPriceToday: searchAndNotifyProductsWithMinPriceToday
}