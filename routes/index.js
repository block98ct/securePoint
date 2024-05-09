const express = require('express');
var router = express.Router();

router.use('/userRouter', require('./userRouter'))

// // Mounting the adminRouter under the '/router' path prefix
// router.use('/adminRouter', require('./adminRouter'))
// router.use("/superAdminRouter", require('./superAdminRouter'))



module.exports = router
