const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const moduleStatusSchema = mongoose.Schema({
    moduleStatusId: { type: ObjectId, default: new ObjectId(), unique: true, index: true },
    moduleId: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true },
    chapterStatus: [{ chapterId:String, status:String }],
    enrollmentDate: { type: Date, required: true },
    completionDate: { type: Date},
    isCompleted:{type: Boolean,default: false},
    assessmentScore: { type: Number },

}, {
    timestamps: true
})
module.exports = mongoose.model('ModuleStatus', moduleStatusSchema)