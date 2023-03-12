const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const courseStatusSchema = mongoose.Schema({
    courseStatusId: { type: ObjectId, default: new ObjectId(), unique: true, index: true },
    isCompleted:{type: Boolean,default: false},
    enrollmentDate: { type: Date, required: true },
    completionDate: { type: Date},
    courseId: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    courseModulesStatus: [{ type: mongoose.Types.ObjectId, ref: 'ModuleStatus', required: true }],
    assessmentScore: { type: Number },
}, {
    timestamps: true
})
module.exports = mongoose.model('CourseStatus', courseStatusSchema)