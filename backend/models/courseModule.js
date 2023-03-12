const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const ModuleSchema = mongoose.Schema({
    moduleId: { type: ObjectId, default: new ObjectId(), unique: true, index: true },
    moduleTitle: { type: String, required: true },
    moduleFee: { type: Number },
    moduleCourseId: { type: mongoose.Types.ObjectId, ref: 'CourseChapter' },
    chapterIds: [{ type: mongoose.Types.ObjectId, ref: 'CourseChapter' }],
    moduleAssessmentIds: [{ type: mongoose.Types.ObjectId, ref: 'CourseAssessment' }]
    
}, {
    timestamps: true
})
module.exports = mongoose.model('CourseModule', ModuleSchema)
