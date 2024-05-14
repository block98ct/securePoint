import express from "express"
const router = express.Router();
import userRouter from "./userRouter.js"

router.use('/userRouter', userRouter)

// // Mounting the adminRouter under the '/router' path prefix
// router.use('/adminRouter', require('./adminRouter'))
// router.use("/superAdminRouter", require('./superAdminRouter'))


export default router
