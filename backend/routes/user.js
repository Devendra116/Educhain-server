const express = require('express')
const router = express.Router()
const {userLogin,registerUser,updateUser,deleteUser,courseCompleted}=require('../controllers/user')

router.post('/login',userLogin)
router.post('/',registerUser)
router.get('/course-completed',courseCompleted)
router.put('/update/:userId',updateUser)
router.delete('/delete/:userId',deleteUser)


module.exports = router