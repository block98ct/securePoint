// Importing the bcryptjs library for password hashing
import bcrypt from'bcryptjs'
import  jwt from'jsonwebtoken'


// Function to hash the given password using bcrypt
export const hashPassword = async (password, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }
    return null;
}

// Function to compare the given password with a hash using bcrypt
export const comparePassword = async (pass, hash) => {
    try {
        const match = await bcrypt.compare(pass.toString(), hash);
        if (match) {
            return match;
        }
    } catch (error) {
        console.log(error);
    }
    return false;
}

// Middleware function to authenticate a token
export const authenticateToken = async (req, res, next) => {
    const authToken = req.header('Authorization');
    if (!authToken) return res.status(401).send('Please provide a token');
    let token = authToken.split(' ').slice(-1)[0];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.decoded = decoded;
        next();
    } catch (error) {
        res.status(403).send('Invalid token');
    }
}




export const generateRandomPassword = async (length) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


 export const generateOTP = async()=> {
    return Math.floor(100000 + Math.random() * 900000); 
  }

