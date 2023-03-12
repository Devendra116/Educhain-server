const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const courseAssessmentSchema = mongoose.Schema({
    assessmentId:{ type: ObjectId, default: new ObjectId(), unique: true, index: true },
    question: { type: String, required: true },
    optionA: { type: String, required: true },
    optionB: { type: String, required: true },
    optionC: { type: String, required: true },
    optionD: { type: String, required: true },
    correctOption: { type: String, required: true },

}, {
    timestamps: true
})
module.exports = mongoose.model('CourseAssessment', courseAssessmentSchema)
