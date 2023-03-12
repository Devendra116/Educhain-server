const Course = require('../models/course')
const User = require('../models/user')
const CourseModule = require('../models/courseModule')
const CourseStatus = require('../models/courseStatus')
const ModuleStatus = require('../models/moduleStatus')
const ObjectId = require('mongoose').Types.ObjectId;

// demonstrates how to get a transaction status
const { providers } = require("near-api-js");
const { default: mongoose } = require('mongoose');

//network config (replace testnet with mainnet or betanet)
const provider = new providers.JsonRpcProvider(
    "https://archival-rpc.testnet.near.org"
);


// @Querying historical data (older than 5 epochs or ~2.5 days) ->  "https://archival-rpc.testnet.near.org" <Maximum number of requests per IP: 600 req/min>
// @Querying historical data (lesser than 5 epochs or ~2.5 days) ->  "https://rpc.testnet.near.org"         <Maximum number of requests per IP: 600 req/min>

// @desc    Get all courses
// @route   GET /course
// @access  Public
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
        res.status(200).json(courses)
    } catch (error) {
        res.status(400).send({ message: `Error getting courses ${error}` });
    }

}


// @desc    Get Particular course detail
// @route   GET /course/:courseId
// @access  Public
const getCourseDetail = async (req, res) => {
    // const course = await Course.find({courseId:req.params.courseId});
    console.log(req.params.courseId)
    // const data = await Course.findOne({courseId:req.params.courseId}).populate({
    //     path: 'courseModules',
    //     model: 'CourseModule',
    //     localField: 'courseId',
    //     foreignField: 'moduleId',
    //     strictPopulate: false
    // });
    // let data = await Course.find({courseId:req.params.courseId})
    //     .populate({
    //         path: 'courseModules',
    //         model: 'CourseModule',
    //         strictPopulate: false
    //     })
    //     .exec(function(err, courses) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             console.log(courses);
    //              return courses
    //         }
    //     });
    try {
        let data = await Course.findOne({ courseId: req.params.courseId }).populate('courseModules')
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send({ message: `Error Getting course ${error}` });

    }

}
const createCourse = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        console.log("in createCourse")

        let moduleList = []
        for (let i = 1; i <= req.body.totalmodules; i++) {
            moduleList.push({ moduleId: new ObjectId(), moduleTitle: req.body["module" + i] })
        }
        const modulesAdded = await CourseModule.create(moduleList, { session })
        let moduleIdList = []
        modulesAdded.forEach(module => {
            moduleIdList.push(module._id)
        });
        // console.log(modulesAdded);
        // console.log(moduleIdList);
        const course = new Course({
            courseId: new ObjectId(),
            courseTitle: req.body.courseTitle,
            courseBrief: req.body.courseBrief,
            // courseFee: req.body.courseFee,
            // language: req.body.language,
            // timeRequired: req.body.timeRequired,
            tags: req.body.tags,
            // instructorId: req.body.instructorId,
            courseModules: moduleIdList,
            // courseAssessmentIds: req.body.courseAssessmentIds
        });
        await course.save({ session });
        await session.commitTransaction();
        res.status(201).send({ message: 'Course created successfully' });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).send({ message: `Error creating course ${error}` });
    } finally {
        session.endSession();
    }
};

const searchCourses = async (req, res) => {
    try {
        console.log("in searchCourses ")
        const tags = req.query.tags;
        const courses = await Course.find({ tags: { $in: tags } });
        console.log("out searchCourses ")

        res.send(courses);
    } catch (error) {
        res.status(400).send({ message: 'Error searching courses' });
    }
};


// @desc    Payment confirmation and course Enrollment
// @route   GET /course/approval?transactionId
// @access  Restricted  
const courseApproval = async (req, res) => {
    console.log("called courseApproval")
    console.log("req.query.transactionId", req.query.transactionId)
    const txresponse = await provider.txStatus(req.query.transactionId, 'testnet');
    console.log(txresponse.transaction.actions[0].FunctionCall.deposit)
    // console.log(txresponse.receipts_outcome)
    console.log(txresponse.transaction.signer_id)
    // console.log(txresponse.transaction.actions)
    // console.log(txresponse.transaction_outcome)
    const function_args = JSON.parse(Buffer.from(txresponse.transaction.actions[0].FunctionCall.args, 'base64').toString('utf8'))
    console.log(Buffer.from(txresponse.status.SuccessValue, 'base64').toString('utf8'))
    console.log(Buffer.from(txresponse.transaction.actions[0].FunctionCall.args, 'base64').toString('utf8'))
    let user_account = txresponse.transaction.signer_id;
    if (function_args.gift_to) user_account = function_args.gift_to

    console.log("function_args", function_args)
    // let user_id=
    try {
        const current_time = new Date();
        const user = await User.findOne({ nearWallet: user_account })
        
        for (const course in function_args.courses) {
            const course_enrolled = await CourseStatus.findOne({ courseId: course })
            if (course_enrolled) {
                //update the status of course already enrolled
                const course_status = await CourseStatus.updateOne({ courseId: course }, {})
            } else {
                let module_list = []
                for (const module_id in function_args.courses[course]) {
                    const module_info = await CourseModule.findOne({moduleId:module_id}).populate("chapterIds")
                    // for(const chapter in module_info.chapterIds){}
                    module_list.push({
                        moduleStatusId: new ObjectId(),
                        moduleId: module_id,
                        userId: user._id,
                        chapterStatus: [{ chaptername: String, status: String }],
                        enrollmentDate: current_time,
                        assessmentScore: 0,

                    })
            }
            const course_status = await CourseStatus.create({
                courseStatusId: new ObjectId(),
                enrollmentDate: current_time,
                courseId: course,
                userId: user._id,
                courseModulesStatus: [{ type: mongoose.Types.ObjectId, ref: 'ModuleStatus', required: true }],
                assessmentScore: 0
            })
        }
        console.log(course)
        console.log(function_args.courses[course])
    }
    } catch (error) {

}
res.status(200).json({ "mesage": "done", "tx": txresponse })

}

module.exports = { getCourses, searchCourses, getCourseDetail, createCourse, courseApproval }