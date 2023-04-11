const mongoose = require('mongoose')

const ngoSchema = mongoose.Schema({
    ngoId: { type: String, required: true, unique: true },
    emailId: { type: String, required: [true, 'Please add an email'] },
    name: { type: String, required: true },
    password: { type: String, required: [true, 'Please add an password'] },
    phone: { type: Number },
    location: { type: String },
    ngoUserId: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    courseEnrolled: [{ type: mongoose.Types.ObjectId, ref: 'Course' }],
    nearWallet: { type: String },
    secretCode: { type: String },
    maxUserCount:{type:Number},
    joinedUserCount:{type:Number}

}, {
    timestamps: true
})
module.exports = mongoose.model('NGO', ngoSchema)
