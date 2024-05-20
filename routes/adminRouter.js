import express from "express"
import adminController from '../controllers/adminController'
import  { upload} from "../helpers/multer.js"
import { authenticateToken }  from '../helpers/middleware.js'



const app = express()




export default app;

