const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Course = require('../models/course')
const cookieParser = require('cookie-parser')
const ObjectId = require('mongoose').Types.ObjectId;

 
// @desc    Authenticate a user
// @route   POST /user
// @access  Public
const userLogin = async (req, res) => {
    try {
        // Find the user
        const user = await User.findOne({ emailId: req.body.emailId });
        if (!user) return res.status(400).send({ message: 'Invalid credentials' });

        // Compare the passwords
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' });

        // Generate a token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // Return the token
        res.cookie('token', token, { httpOnly: true }).send({ userId: user._id });
    } catch (error) {
        res.status(400).send({ message: 'Error logging in' });
    }
};


// @desc    Fetch course-completed
// @route   GET /user/course-completed 
// @access  Public
const courseCompleted = async (req, res) => {
    try {
        const coursecompleted = await Course.findAll()
        res.sendStatus(200).json(coursecompleted)
    } catch (error) {
        res.sendStatus(401).json('Unable to fetch courses')
    }
}

// @desc    Register a new user
// @route   POST /user
// @access  Public
const registerUser = async (req, res) => {
    try {
        // let user;
        // Check if the email already exists
        let user__ = await User.findOne({ emailId: req.body.emailId });
        if (user__) return res.status(400).send({ message: 'Email already exists' });

        // Check if the nearWallet already exists
        // let user_ = await User.findOne({ nearWallet: req.body.nearWallet });
        // if (user_) return res.status(400).send({ message: 'nearWallet already exists' });

        // Create the user
        const user = new User({
            userId: new ObjectId(),
            emailId: req.body.emailId,
            // nearWallet: req.body.nearWallet,
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        // Add optional fields if they are provided
        // if (req.body.firstname) user.firstname = req.body.firstname;
        // if (req.body.lastname) user.lastname = req.body.lastname;
        // if (req.body.organization) user.organization = req.body.organization;
        // if (req.body.ngo) user.ngo = req.body.ngo;
        // if (req.body.areaOfInterests) user.areaOfInterests = req.body.areaOfInterests;

        // Save the user
        await user.save();

        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).send({ message: `Error creating user ${error}` });
    }
};

// @desc    Update a existing user
// @route   POST /user
// @access  Private
const updateUser = async (req, res) => {
    const { emailId, nearWallet, password, firstname, lastname, organization, ngo, areaOfInterests } = req.body;
    console.log("check 1")
    try {
        // Find the user
        const user = await User.findOne({ 'userId': req.params.userId });
        if (!user) return res.status(404).send({ message: 'User not found' });
        console.log("check 2")

        // Update the user information
        if (emailId) user.emailId = emailId;
        if (nearWallet) user.nearWallet = nearWallet;
        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (organization) user.organization = organization;
        if (ngo) user.ngo = ngo;
        if (areaOfInterests) user.areaOfInterests = areaOfInterests;

        // Hash the password if it was updated
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        console.log("check 3")

        await user.save();
        console.log("check 4")

        res.status(200).send({ message: 'User updated successfully' });
    } catch (error) {
        res.status(400).send({ message: `Error updating user ${error} ` });
    }
};

// @desc    Delete a exisiting user
// @route   POST /user
// @access  Private
const deleteUser = async (req, res) => {
    try {
        // Find the user
        const user = await User.findOne({ 'userId': req.params.userId });
        if (!user) return res.status(404).send({ message: 'User not found' });

        // Delete the user
        await user.remove();
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).send({ message: 'Error deleting user' });
    }
};

module.exports = { userLogin, registerUser, updateUser, deleteUser, courseCompleted }