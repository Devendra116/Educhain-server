const mongoose = require('mongoose')

const instructorSchema = mongoose.Schema({
    instructorId: { type: String, required: true, unique: true },
    emailId: { type: String, required: [true, 'Please add an email'] },
    nearWallet: { type: String, required: [true, 'Please add an near account address'] },
    password: { type: String, required: [true, 'Please add an password'] },
    firstname: { type: String },
    lastname: { type: String },
    qualification: { type: String },
    profileImg: { type: String },
    bio: { type: String },
    courseUploded: [{ type: mongoose.Types.ObjectId, ref: 'Course' }],

}, {
    timestamps: true
})
module.exports = mongoose.model('Instructor', instructorSchema)
