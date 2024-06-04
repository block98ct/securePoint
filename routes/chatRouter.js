import express from "express"
const app = express()
import {chatController} from  "../controllers/index.js"
import { authenticateToken }  from '../helpers/middleware.js'


app.get('/sendMessage', authenticateToken, chatController.sendMessage)

export default app