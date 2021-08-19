const mongoose = require('mongoose')
const utils = require('../utils')

const changePasswordEntrySchema = new mongoose.Schema({
    userObjectId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    key: { type: String, required: true }
})

changePasswordEntrySchema.statics.createChangePasswordEntry = function (email) {
    return new Promise((resolve, reject) => {
        // Get userDoc associated with the email
        User.findUserByEmail(email)
            .then((userDoc) => {
                if (!userDoc) {
                    reject({ status: "ERROR", message: "No such user exists!" })
                } else {
                    // Check if entry already exists
                    ChangePasswordEntry.findOne({ userObjectId: userDoc._id }, (changePasswordEntryDoc) => {
                        if (changePasswordEntryDoc) {
                            reject({ status: "ERROR", message: "Reset password request already stored!" })
                        } else {
                            // Now create the new password change entry
                            var newChangePasswordEntryDoc = new ChangePasswordEntry({
                                userObjectId: userDoc._id,
                                key: utils.getRandomHexString(32)
                            })
                            newChangePasswordEntryDoc.save((err) => {
                                if (err) {
                                    reject({ status: "ERROR", message: err })
                                } else {
                                    resolve({ status: "OK", message: "Change Password Entry added!" })
                                }
                            })
                        }
                    })
                }
            })
            .catch((err) => { reject({ status: "ERROR", message: err }) })
    })
}

changePasswordEntrySchema.statics.validateChangePasswordEntry = function (email, key) {
    return new Promise((resolve, reject) => {
        // Get userDoc associated with the email
        User.findUserByEmail(email)
            .then((userDoc) => {
                if (!userDoc) { reject({ status: "ERROR", message: "No such user exists!" }) }
                else {
                    ChangePasswordEntry.findOne({
                        $and: [{ userObjectId: userDoc._id }, { key: key }]
                    })
                        .then((changePasswordEntryDoc) => {
                            if (!changePasswordEntryDoc) {
                                // If validation failed
                                reject({ status: "ERROR", message: "Validation failed!" })
                            } else {
                                // Validation succeeded
                                ChangePasswordEntry.deleteOne({ _id: changePasswordEntryDoc._id }, (err) => {
                                    if (err) {
                                        reject({ status: "ERROR", message: err })
                                    } else {
                                        resolve({ status: "OK", message: "Successfully validated!" })
                                    }
                                })
                            }
                        })
                        .catch((err) => { reject({ status: "ERROR", message: err }) })
                }
            })
            .catch((err) => { reject({ status: "ERROR", message: err }) })
    })
}

const ChangePasswordEntry = mongoose.model("ChangePasswordEntry", changePasswordEntrySchema)

module.exports = ChangePasswordEntry