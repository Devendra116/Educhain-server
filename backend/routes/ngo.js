const express = require('express')
const router = express.Router()
const { getNgoDetail,generateToken,registerNgo,registerNgoUser,getNgoUsers ,ngoAdminLogin} = require('../controllers/ngo')

router.get('/:ngoId', getNgoDetail)
router.post('', registerNgo)
router.post('/login', ngoAdminLogin)
router.post('/generate-token', generateToken)
router.get('/users', getNgoUsers)
router.post('/user', registerNgoUser)

module.exports = router