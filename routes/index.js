import express from "express"
const router = express.Router();
import userRouter from "./userRouter.js"
// import adminRouter from "./adminRouter.js"

router.use('/userRouter', userRouter)
// router.use('./adminRouter', adminRouter)
// // Mounting the adminRouter under the '/router' path prefix
// router.use('/adminRouter', require('./adminRouter'))
// router.use("/superAdminRouter", require('./superAdminRouter'))


export default router
