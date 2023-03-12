const mongoose = require('mongoose')

const ngoSchema = mongoose.Schema({
    ngoId: { type: String, required: true, unique: true },
    emailId: { type: String, required: [true, 'Please add an email'] },
    name: { type: String, required: true },
    phone: { type: Number },
    location: { type: String },
    ngo_user_id: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    courseEnrolled:[{ type: mongoose.Types.ObjectId, ref: 'Course' }],
    nearWallet: { type: String, required: [true, 'Please add an near account address'] },

}, {
    timestamps: true
})
module.exports = mongoose.model('NGO', ngoSchema)
