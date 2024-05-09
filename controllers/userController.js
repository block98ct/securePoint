// Import necessary modules and dependencies
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = process.env.JWT_SECRET_KEY;
const Msg = require("../helpers/message");
const { mail } = require("../helpers/emailOtp");

const { hashPassword, generateOTP } = require("../helpers/middleware");
const {
  fetchUserByEmail,
  fetchUserByNumber,
  userRegister,
  updateUserOtpToVerifiedByEmail,
  updatePasswordByEmail,
  updateUserOtpToVerifiedByNumber,
  setLoginStatus,
  updatePasswordByNumber,
  setLoginStatusByNumber
} = require("../models/user.model");
const { emit } = require("../routes/userRouter");

exports.registerUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userResp = await fetchUserByEmail(email);

    if (userResp.length > 0) {
      return res.status(201).send({
        success: false,
        msg: Msg.emailExists,
      });
    }
    const otp = await generateOTP();
    await mail(email, otp);
    let obj = {
      email,
      otp,
    };

    await userRegister(obj);

    return res
      .status(200)
      .json({ success: true, message: Msg.otpSent, data: otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ success: false, message: Msg.err });
  }
};

exports.registerUserByNumber = async (req, res) => {
  try {
    const { number } = req.body;
    const userResp = await fetchUserByNumber(number);

    if (userResp.length > 0) {
      return res.status(201).send({
        success: false,
        msg: Msg.numberExists,
      });
    }
    const otp = await generateOTP();
    let obj = {
      contactNumber: number,
      otp,
    };

    await userRegister(obj);

    return res
      .status(200)
      .json({ success: true, message: Msg.otpSent, data: otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ success: false, message: Msg.err });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp, number } = req.body;

  try {
    if (email) {
      const user = await fetchUserByEmail(email);
      if (!user) {
        return res
          .status(201)
          .json({ success: false, message: Msg.inValidEmail });
      }
      if (user[0].otp !== otp) {
        return res
          .status(201)
          .json({ success: false, message: Msg.invalidOtp });
      }
      let obj = {
        email,
        isVerified: 1,
      };
      await updateUserOtpToVerifiedByEmail(obj);
    } else {
      const userByNumber = await fetchUserByNumber(number);
      if (!userByNumber) {
        return res
          .status(201)
          .json({ success: false, message: Msg.inValidEmail });
      }
      if (userByNumber[0].otp !== otp) {
        return res
          .status(201)
          .json({ success: false, message: Msg.invalidOtp });
      }
      let obj = {
        contactNumber: number,
        isVerified: 1,
      };
      await updateUserOtpToVerifiedByNumber(obj);
    }

    return res.status(200).json({ success: true, message: Msg.otpMatched });
  } catch (error) {
    console.error(":", error);
    return res
      .status(201)
      .json({ success: false, message: Msg.failedToResest });
  }
};

exports.setPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword, number } = req.body;
    if (email) {
      const userResp = await fetchUserByEmail(email);

      if (userResp[0].isVerified == 0) {
        return res.status(201).send({
          success: false,
          msg: Msg.notVerifyAccount,
        });
      }

      if (userResp.length == 0) {
        return res.status(201).send({
          success: false,
          msg: Msg.inValidEmail,
        });
      }

      if (password !== confirmPassword) {
        return res
          .status(201)
          .json({ success: false, message: Msg.pwdNotMatch });
      }

      const Password = await hashPassword(password);
      let obj = {
        password: Password,
        email,
      };
      updatePasswordByEmail(obj);
    } else {
      const userResp = await fetchUserByNumber(number);

      if (userResp[0].isVerified == 0) {
        return res.status(201).send({
          success: false,
          msg: Msg.notVerifyAccount,
        });
      }

      if (userResp.length == 0) {
        return res.status(201).send({
          success: false,
          msg: Msg.inValidEmail,
        });
      }

      if (password !== confirmPassword) {
        return res
          .status(201)
          .json({ success: false, message: Msg.pwdNotMatch });
      }

      const Password = await hashPassword(password);
      let obj = {
        password: Password,
        contactNumber: number,
      };
      updatePasswordByNumber(obj);
    }

    return res.status(200).json({ success: true, message: Msg.signUpSuccess });
  } catch (error) {
    console.error(":", error);
    return res
      .status(201)
      .json({ success: false, message: Msg.failedToResest });
  }
};
exports.userLogin = async (req, res) => {
  const { email, password, number } = req.body;
  let token
  let userResp
  try {
    if (email) {
      if (!email || !password) {
        return res.status(400).send({
          status: false,
          msg: Msg.allFieldsRequired,
        });
      }
      userResp = await fetchUserByEmail(email);
      if (userResp.length == 0) {
        return res.status(201).send({
          success: false,
          msg: Msg.inValidEmail,
        });
      }

      if (userResp[0].email !== email) {
        return res.status(201).send({
          status: false,
          msg: Msg.invalidCread,
        });
      }

      if (userResp[0].status == 0) {
        return res.status(201).send({
          status: false,
          msg: Msg.accountDeactiveated,
        });
      }

      let Password = await userResp[0].password;

      let checkPassword = await bcrypt.compare(password, Password);

      if (!checkPassword) {
        return res.status(201).send({
          status: false,
          msg: Msg.invalidCread,
        });
      }
      const id = { adminId: userResp[0].id };
      token = jwt.sign(id, secretKey, { expiresIn: "1h" });

      const lastlogin = new Date();
      let obj = {
        lastlogin,
        email,
      };

      await setLoginStatus(obj);
    } else {
      if (!number || !password) {
        return res.status(400).send({
          status: false,
          msg: Msg.allFieldsRequired,
        });
      }
       userResp = await fetchUserByNumber(number);
      if (userResp.length == 0) {
        return res.status(201).send({
          success: false,
          msg: Msg.inValidNumber,
        });
      }

      if (userResp[0].contactNumber !== number) {
        return res.status(201).send({
          status: false,
          msg: Msg.invalidCread,
        });
      }

      if (userResp[0].status == 0) {
        return res.status(201).send({
          status: false,
          msg: Msg.accountDeactiveated,
        });
      }

      let Password = await userResp[0].password;

      let checkPassword = await bcrypt.compare(password, Password);

      if (!checkPassword) {
        return res.status(201).send({
          status: false,
          msg: Msg.invalidCread,
        });
      }
      const id = { adminId: userResp[0].id };
      token = jwt.sign(id, secretKey, { expiresIn: "1h" });

      const lastlogin = new Date();
      let obj = {
        lastlogin:lastlogin,
        contactNumber: number,
      };

      await setLoginStatusByNumber(obj);
    }
    
    return res.status(200).send({
      status: true,
      msg: Msg.loginSuccesfully,
      token: token,
      roll: userResp[0].roll,
    });
  } catch (error) {
    console.log(error);
    return res.status(201).send({
      status: false,
      msg: Msg.err,
    });
  }
};


