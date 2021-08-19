const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Product = require('./models/product')

// VARS
const currencies = JSON.parse(fs.readFileSync(path.join(__dirname, "currencies.json").toString()))
const ccs = []
for (var i = 0; i < currencies.length; i++) { ccs.push(currencies[i].cc) }

// FUNCTIONS
const getHash = (password) => {
    return crypto.createHash('sha3-512').update(password).digest('hex')
}

const getCurrencyByCC = (cc) => {
    return currencies.find((currency) => { return currency.cc == cc })
}

const getAllCurrencyCC = () => {
    return ccs
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
        .then((result) => { console.log(`${Date.now()} -> ${result.message}`) })
        .catch((err) => { console.log(err.message) })
}

module.exports = {
    getHash: getHash,
    getCurrencyByCC: getCurrencyByCC,
    getAllCurrencyCC: getAllCurrencyCC,
    removeInArray: removeInArray,
    stringToObjectId: stringToObjectId,
    objectIdToString: objectIdToString,
    getRandomHexString: getRandomHexString,
    collectAllProductPrices: collectAllProductPrices
}