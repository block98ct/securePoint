import express from "express"
const router = express.Router();
import userRouter from "./userRouter.js"
import adminRouter from "./adminRouter.js"
import chatRouter from "./chatRouter.js"

router.use('/userRouter', userRouter)
router.use('/userRouter/chat', chatRouter)
router.use('/adminRouter', adminRouter)
// // Mounting the adminRouter under the '/router' path prefix
// router.use("/superAdminRouter", require('./superAdminRouter'))


export default router
