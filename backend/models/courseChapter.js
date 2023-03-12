const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const courseChapterSchema = mongoose.Schema({
    courseChapterId: { type: ObjectId, default: new ObjectId(), unique: true, index: true },
    chapterSequence: { type: Number, required: true },
    chapterName: { type: String, required: true },
    chapterVideo: { type: String, required: true },
    timeRequired: { type: Number, required: true },

}, {
    timestamps: true
})
module.exports = mongoose.model('CourseChapter', courseChapterSchema)
