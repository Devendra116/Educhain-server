const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const userSchema = mongoose.Schema({
    userId: { type: ObjectId, default: new ObjectId(), unique: true, index: true },
    emailId: { type: String, required: [true, 'Please add an email'] },
    nearWallet: { type: String },
    password: { type: String, required: [true, 'Please add an password'] },
    firstname: { type: String },
    lastname: { type: String },
    organization: { type: String },
    ngo: { type: String },
    areaOfInterests: [{ type: String }],

}, {
    timestamps: true
})
module.exports = mongoose.model('User', userSchema)
