import express from "express"
import {adminController} from '../controllers/index.js'
import  { upload} from "../helpers/multer.js"
import { authenticateToken }  from '../helpers/middleware.js'


const app = express()
app.post('/addCategories', authenticateToken, upload.single('categoryImage'), adminController.addCategories)
app.post('/addSubcategories', authenticateToken, adminController.addSubCategories)



export default app;

