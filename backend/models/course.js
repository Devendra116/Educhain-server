const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const courseSchema = mongoose.Schema({
    courseId: { type: ObjectId, default: new ObjectId(), unique: true, index: true },
    courseTitle: { type: String, required: true },
    courseBrief: { type: String, required: true },
    courseFee: { type: Number },
    language: { type: String },
    timeRequired: { type: String },
    tags: [{ type: String }],
    rating: {type:Number},
    image:{type:String},
    instructorId: { type: mongoose.Types.ObjectId, ref: 'Instructor' },
    courseModules: [{ type: mongoose.Types.ObjectId, ref: 'CourseModule' }],
    courseAssessmentIds: [{ type: mongoose.Types.ObjectId, ref: 'CourseAssessment' }],
    courseCompleted: { type: Boolean },
    courseApproved: { type: Boolean }
}, {
    timestamps: true
})



module.exports = mongoose.model('Course', courseSchema)
