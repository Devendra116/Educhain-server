const NgoModel = require("../models/ngo")
const UserModel = require("../models/user")
const ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken')
// import { v4 as uuidv4 } from 'uuid';
const v4 = require("uuid").v4
const bcrypt = require('bcryptjs')



// @desc    Authenticate a user
// @route   POST /admin/login
// @access  Public
const ngoAdminLogin = async (req, res) => {
    try {
        // Find the user
        const ngoAdmin = await NgoModel.findOne({ emailId: req.body.emailId });
        if (!ngoAdmin) return res.status(400).send({ message: 'Invalid credentials' });

        // Compare the passwords
        const isMatch = await bcrypt.compare(req.body.password, ngoAdmin.password);
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

        // Generate a token
        const token = jwt.sign({ adminId: ngoAdmin._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // Return the token
        res.status(200).send({ adminId: ngoAdmin._id, token });
    } catch (error) {
        res.status(400).send({ message:  `Error logging in ${error} ` });
    }
};

// @desc    Register a NGO admin
// @route   POST /ngo
// @access  Public
// const registerAdmin = async (req, res) => {
//     try {
//         // let user;
//         // Check if the email already exists
//         const { emailId, name, phone, location,password } = req.body;
//         let admin__ = await NgoModel.findOne({ emailId });
//         if (admin__) return res.status(400).send({ message: 'Email already exists' });

//         // Check if the nearWallet already exists
//         // let user_ = await User.findOne({ nearWallet: req.body.nearWallet });
//         // if (user_) return res.status(400).send({ message: 'nearWallet already exists' });

//         // Create the user
//         const admin = new NgoModel({
//             ngoId: new ObjectId(),
//             emailId,
//             name,
//             phone,
//             location,
//             ngoUserId: [],
//             courseEnrolled: [],
//         });

//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         admin.password = await bcrypt.hash(password, salt);

//         // Save the admin
//         await admin.save();

//         res.status(201).send({ message: 'Admin created successfully' });
//     } catch (error) {
//         res.status(400).send({ message: `Error creating user ${error}` });
//     }
// };

// @desc    Get NGO detail
// @route   GET /ngo/:ngoId
// @access  Private
const getNgoDetail = async (req, res) => {
    try {
        // const ngo = await NgoModel.find({ ngoId: req.params.ngoId })
        const ngo = await NgoModel.find()
        res.status(200).json(ngo)
    } catch (error) {
        res.status(400).send({ message: `Error getting NGO detail ${error}` });
    }
}

// @desc    Generate Token for NGO student registration 
// @route   POST /ngo/generate-token
// @access  Private
const generateToken = async (req, res) => {
    try {
        const uuidToken = v4();
        const ngo = await NgoModel.findOne({ ngoId: req.body.ngoId })
        console.log(ngo)
        console.log(ngo.secretCode)

        if (ngo.secretCode) {
            console.log("ngo.secretCode", ngo.secretCode)
            return res.status(400).json({ "message": "Token Already Exist" })
        }
        if (0 < req.body.maxUserCount <= 50) {
            return res.status(400).json({ "message": "maxUserCount should be greater than 0 and less than 50" })
        }
        const query = { ngoId: req.body.ngoId };
        const update = {
            $set: {
                secretCode: uuidToken,
                maxUserCount: req.body.maxUserCount
            }
        }
        await NgoModel.findOneAndUpdate(query, update)

        res.status(200).json({ "message": `Secret code generated `, "code": uuidToken })
    } catch (error) {
        res.status(400).send({ message: `Error getting NGO detail ${error}` });
    }
}

// @desc    Register a new NGO
// @route   POST /ngo
// @access  Public
const registerNgo = async (req, res) => {
    try {
        console.log("in registerNgo ");
        console.log(req.body.emailId);
        // console.log(req.body.nearWallet);
        // const query = {
        //     $or: [
        //         { emailId: { $eq: req.body.emailId } },
        //         { nearWallet: { $eq: req.body.nearWallet } }
        //     ]
        // };
        const query = { emailId: { $eq: req.body.emailId } }

        let ngo = await NgoModel.findOne(query);
        if (ngo) {
            return res.status(400).send({ message: 'NGO already exists for given Email' });
        }


        // Create the NGO

        const newNgo = new NgoModel({
            ngoId: new ObjectId(),
            emailId: req.body.emailId,
            // nearWallet: req.body.nearWallet,
            name: req.body.name,
            phone: req.body.phone,
            location: req.body.location,
            ngo_user_id: [],
            courseEnrolled: [],
            joinedUserCount: 0
        });
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        newNgo.password = await bcrypt.hash(req.body.password, salt);


        await newNgo.save();

        res.status(201).send({ message: 'NGO created successfully' });
    } catch (error) {
        res.status(400).send({ message: `Error creating NGO ${error}` });
    }
};

// @desc    Register a new NGO user
// @route   POST /ngo/user
// @access  Public
const registerNgoUser = async (req, res) => {
    try {
        // const query = {
        //     $or: [
        //         { emailId: { $eq: req.body.emailId } },
        //         { nearWallet: { $eq: req.body.nearWallet } }
        //     ]
        // };

        const query = { emailId: { $eq: req.body.emailId } };
        let user = await UserModel.findOne(query);
        if (user) {
            return res.status(400).send({ message: 'User already exists for given Email' });
        }

        if (!req.body.secret) return res.status(400).send({ message: 'Enter the Secret code to join as NGO associate User' });

        // find NGO from code 
        // NgoModel.findOne({ secretCode: req.body.secret }, (err, ngo) => {
        //     if (err) return res.status(400).send({ message: "No NGO found", "error": `Error Occured: ${err}` });

        //     if (ngo.maxUserCount <= ngo.joinedUserCount) return res.status(400).send({ message: 'The Code has reached its Limit, Please Contact NGO admin' });
        // })

        const ngo = await NgoModel.findOne({ secretCode: req.body.secret })

        if (!ngo) return res.status(400).send({ message: "No NGO found" });
        if (ngo.maxUserCount <= ngo.joinedUserCount) return res.status(400).send({ message: 'The Code has reached its Limit, Please Contact NGO admin' });

        console.log(ngo)
        // Create the User
        const createUser = new UserModel({
            userId: new ObjectId(),
            emailId: req.body.emailId,
            // nearWallet: req.body.nearWallet,
            ngo: ngo._id
        });


        // Hash the password
        const salt = await bcrypt.genSalt(10);
        createUser.password = await bcrypt.hash(req.body.password, salt);


        await createUser.save();
        await NgoModel.findOneAndUpdate({ ngo }, { $inc: { joinedUserCount: 1 }, $push: { ngoUserId: createUser._id } })

        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).send({ message: `Error creating User ${error}` });
    }
};

// @desc    Get All user for respective NGO
// @route   GET /ngo/users
// @access  Private
const getNgoUsers = async (req, res) => {
    try {
        console.log("req", req.body.ngoId)
        const ngoUsers = await NgoModel.findOne({ ngoId: req.body.ngoId }).populate("ngoUserId")
        res.status(200).json(ngoUsers)
    } catch (error) {
        res.status(400).send({ message: `Error getting NGO Users ${error}` });
    }
}

module.exports = { getNgoDetail, generateToken, registerNgo, registerNgoUser, getNgoUsers, ngoAdminLogin }