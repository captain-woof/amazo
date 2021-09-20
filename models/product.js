const mongoose = require('mongoose')
const scraper = require('amazon-buddy')
const utils = require('../utils')

const productSchema = new mongoose.Schema({
    asin: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    /*
    'prices' is JSON array. Each element is a JSON with 'currency_cc' and 'price'.
    'price' is a JSON array, each element is a JSON with 'date' and 'price'
    */
    prices: [{
        currency_cc: { type: String, required: true },
        price: [{
            date: { type: Date },
            price: { type: Number }
        }]
    }]
})

productSchema.statics.findProductByAsin = function (asin) {
    return new Promise((resolve, reject) => {
        this.findOne({ asin: asin }, (err, productDoc) => {
            if (err) {
                reject({ status: "ERROR", message: err })
            } else {
                resolve(productDoc)
            }
        })
    })
}

productSchema.statics.scrapeProduct = function (asin, currencyCC) {
    return new Promise((resolve, reject) => {
        scraper.asin({
            cookie: `i18n-prefs=${currencyCC}`,
            randomUa: true,
            asin: asin,
        }).then(({ result }) => {
            resolve({
                productTitle: result[0].title,
                productDescription: result[0].description,
                productThumbnail: result[0].main_image,
                productPrice: result[0].price.current_price
            })
        }).catch((err) => {
            reject(err)
        })
    })
}

productSchema.statics.findProductByObjectId = function (productObjectId) {
    return new Promise((resolve, reject) => {
        Product.findById(productObjectId, (err, productDoc) => {
            if (err) {
                reject({ status: "ERROR", message: err })
            } else if (!productDoc) {
                reject({ status: "ERROR", message: "No such product exists in database!" })
            } else {
                resolve(productDoc)
            }
        })
    })
}

productSchema.statics.addNewProduct = function (asin, currentUserDoc) {
    return new Promise((resolve, reject) => {
        // Check if product has been already added
        Product.findProductByAsin(asin).then((currentProductDoc) => {
            if (!currentProductDoc) { // If product has not been added
                Product.scrapeProduct(asin, currentUserDoc.currency)
                    .then(({ productTitle, productDescription, productThumbnail, productPrice }) => {
                        // Add product to database
                        var newProduct = new Product({
                            asin: asin,
                            title: productTitle,
                            description: (productDescription.length > 97 ?
                                productDescription.slice(0, 97) + "..." :
                                productDescription),
                            thumbnail: productThumbnail,
                            url: `https://amazon.com/dp/${asin}`,
                            prices: [{
                                currency_cc: currentUserDoc.currency,
                                price: [{
                                    date: Date.now(),
                                    price: productPrice
                                }]
                            }]
                        })
                        newProduct.save((err) => {
                            if (err) {
                                console.log(err)
                                reject({ status: "ERROR", message: err })
                            } else {
                                // Add product to current User
                                var response = currentUserDoc.subscribeToProduct(newProduct._id, asin)

                                // Log result and respond
                                console.log(`Product (ASIN: ${asin}) with currency ${currentUserDoc.currency} added successfully!`)
                                resolve(response)
                            }
                        })
                    })
                    .catch((err) => { reject({ status: "ERROR", message: err }) })
            } else if (!currentProductDoc.prices.find((priceEntry) => {
                return priceEntry.currency_cc == currentUserDoc.currency
            })) {
                // If product is being tracked but the currency has not been added
                Product.scrapeProduct(asin, currentUserDoc.currency).then(({ productPrice }) => {
                    currentProductDoc.prices.push({
                        currency_cc: currentUserDoc.currency,
                        price: [{
                            date: Date.now(),
                            price: productPrice
                        }]
                    })
                    currentProductDoc.save((err) => {
                        if (err) {
                            console.log(`Failed to add currency ${currentUserDoc.currency} to product (ASIN: ${asin})!`)
                            reject(err)
                        } else {
                            // Add product to current User
                            var response = currentUserDoc.subscribeToProduct(currentProductDoc._id, asin)

                            // Log result and respond
                            console.log(`Currency ${currentUserDoc.currency} added to product (ASIN: ${asin}) successfully!`)
                            resolve(response)
                        }
                    })
                }).catch((err) => {
                    res.json(err).end()
                })
            } else { // If product is being tracked with the specified currency already
                // Add product to current User
                var response = currentUserDoc.subscribeToProduct(currentProductDoc._id, asin)
                resolve(response)
            }
        }).catch((err) => {
            reject({ status: "OK", message: err })
        })
    })
}

productSchema.statics.removeUnsubscribedProduct = function (productId, currencyCC) {
    // Search for users subscribed to _id == productId and currency == currencyCC
    // If at least one user is found, do not delete anything, else delete the 
    // array in Product.prices where currency_cc == currencyCC
    return new Promise((resolve, reject) => {
        mongoose.model('User').isAnyUserSubscribedToProductUnderCurrency(productId, currencyCC).then((result) => {
            if (!result) {
                Product.findById(productId, (err, productDoc) => {
                    if (err) {
                        reject({ status: "ERROR", message: err })
                    } else {
                        var priceToDelete = productDoc.prices.find((priceEle) => {
                            return priceEle.currency_cc === currencyCC
                        })
                        productDoc.prices.pull(priceToDelete)
                        productDoc.save((err) => {
                            if (err) {
                                reject({ status: "ERROR", message: err })
                            } else {
                                console.log(`Currency ${priceToDelete.currency_cc} removed from product with ASIN ${productDoc.asin}`)
                                // Now check if the product contains any price at all
                                // If not, it means no one has subscribed to it
                                // Delete it then :(
                                if (productDoc.prices.length === 0) {
                                    Product.deleteOne({ _id: productDoc._id }, (err) => {
                                        if (err) {
                                            reject({ status: "ERROR", message: err })
                                        } else {
                                            console.log(`Product with ASIN ${productDoc.asin} removed!`)
                                            resolve({ status: "OK", message: "Products cleanup successful!" })
                                        }
                                    })
                                } else {
                                    resolve({ status: "OK", message: "Products cleanup successful!" })
                                }
                            }
                        })
                    }
                })
            } else {
                resolve({ status: "OK", message: "No cleanup needed" })
            }
        }).catch((err) => {
            reject(err)
        })
    })
}

productSchema.statics.collectAllProductPrices = function () {
    return new Promise((resolve, reject) => {
        Product.find((err, productDocs) => {
            if (err) {
                reject({ status: "ERROR", message: err })
            } else {
                productDocs.forEach((productDoc) => {
                    productDoc.prices.forEach((priceEle) => {
                        Product.scrapeProduct(productDoc.asin, priceEle.currency_cc)
                            .then(({ productPrice }) => {
                                priceEle.price.push({ date: Date.now(), price: productPrice })
                                productDoc.save()
                            })
                            .catch((err) => { reject({ status: "ERROR", message: err }) })
                    })
                })
                resolve({ status: "OK", message: "All product prices have been/will be updated!" })
            }
        })
    })
}

const Product = mongoose.model("Product", productSchema, 'products')

module.exports = Product