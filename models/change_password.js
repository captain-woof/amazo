const mongoose = require('mongoose')
const User = require('../models/user')
const crypto = require('crypto')

const changePasswordEntrySchema = new mongoose.Schema({
    userObjectId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    key: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now() }
})

changePasswordEntrySchema.statics.createChangePasswordEntry = async (email) => {
    try {
        // Get userDoc associated with the email
        let userDoc = await User.findUserByEmail(email)

        // If no such user exists, ignore. Frontend does not need to know.
        if (userDoc) {
            // Check if entry already exists, delete the previous one if exists, then set new one
            await ChangePasswordEntry.deleteOne({ userObjectId: userDoc._id })

            // Now create the new password change entry
            let resetKey = crypto.randomBytes(32 / 2).toString('hex')         
            let newChangePasswordEntryDoc = new ChangePasswordEntry({
                userObjectId: userDoc._id,
                key: resetKey
            })

            await newChangePasswordEntryDoc.save()            
            return { status: "OK", email: userDoc.email, name: userDoc.name, key: resetKey}
        }
    } catch (err) {
        throw { status: "ERROR", message: err }
    }
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
