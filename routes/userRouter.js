import express from "express"
import {userController} from "../controllers/index.js"
import { userLogin, userSighUp, passwordVallidate, handleValidationErrors } from '../helpers/vallidation.js'
import  { upload} from "../helpers/multer.js"
import { authenticateToken }  from '../helpers/middleware.js'

const app = express()
app.post('/userRegister', userSighUp, handleValidationErrors, userController.registerUserByEmail)
app.post('/userRegisterByNumber', handleValidationErrors, userController.registerUserByNumber)


app.post('/verifyOtp', handleValidationErrors, userController.verifyOtp)
app.post('/setPassword', handleValidationErrors, userController.setPassword)
app.post('/userLogin', handleValidationErrors, userController.userLogin)
app.post('/addAssets', authenticateToken,  handleValidationErrors, upload.array('images', 4), userController.addAssets)
app.post('/updateAssets', authenticateToken,  handleValidationErrors, upload.array('images', 4), userController.updateUserAssetDetails)
app.get('/getAssetsOfUser', authenticateToken,  handleValidationErrors,  userController.getAssetDetails)
app.get('/getAssetsByCategory', authenticateToken,  handleValidationErrors,  userController.getAssetsByCategory)

app.post('/editProfile', authenticateToken,  handleValidationErrors, upload.single('dp'), userController.editProfile)
app.delete('/deleteProfile', authenticateToken,  handleValidationErrors, userController.deleteProfile)



app.post('/addCategories',  handleValidationErrors, upload.single('categoryImage'), userController.addCategories)
app.get('/categoriesList', authenticateToken,  handleValidationErrors,  userController.getCategoryList)

app.get('/allCategoriesCount', authenticateToken,  handleValidationErrors,  userController.allCategoriesAndCount)














export default app