// Import necessary modules and dependencies
import "dotenv/config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Msg from "../helpers/message.js";
import { mail } from "../helpers/emailOtp.js";
import { base_url } from "../config.js";
const secretKey = process.env.JWT_SECRET_KEY;

import { hashPassword, generateOTP } from "../helpers/middleware.js";
import {
  fetchUserByEmail,
  fetchUserByNumber,
  userRegister,
  updateUserOtpToVerifiedByEmail,
  updatePasswordByEmail,
  updateUserOtpToVerifiedByNumber,
  setLoginStatus,
  updatePasswordByNumber,
  setLoginStatusByNumber,
  addDataInAssets,
  updateAssetDetails,
  fetchUserAssetsById,
  fetchUserAssetsImagesById,
  addAssetImges,
  fetchAssetsByCategory,
  assetImages,
  updateProfileName,
  updateProfileDp,
  deleteAssetsByUserId,
  deleteAssetsImagesByUserId,
  deleteUserById,
  insertCategories,
  getCategoriesList,
  getAssetsCountByCategory
} from "../models/user.model.js";

export const registerUserByEmail = async (req, res) => {
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
    return res.status(201).json({ success: false, message: Msg.err });
  }
};

export const registerUserByNumber = async (req, res) => {
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
    return res.status(201).json({ success: false, message: Msg.err });
  }
};

export const verifyOtp = async (req, res) => {
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

export const setPassword = async (req, res) => {
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
export const userLogin = async (req, res) => {
  const { email, password, number } = req.body;
  let token;
  let userResp;
  try {
    if (email) {
      if (!email || !password) {
        return res.status(201).send({
          success: false,
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
          success: false,
          msg: Msg.invalidCread,
        });
      }

      if (userResp[0].status == 0) {
        return res.status(201).send({
          success: false,
          msg: Msg.accountDeactiveated,
        });
      }

      let Password = await userResp[0].password;

      let checkPassword = await bcrypt.compare(password, Password);

      if (!checkPassword) {
        return res.status(201).send({
          success: false,
          msg: Msg.invalidCread,
        });
      }
      const id = { userId: userResp[0].id };
      token = jwt.sign(id, secretKey, { expiresIn: "1h" });

      const lastlogin = new Date();
      let obj = {
        lastlogin,
        email,
      };

      await setLoginStatus(obj);
    } else {
      if (!number || !password) {
        return res.status(201).send({
          success: false,
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
        return res.success(201).send({
          success: false,
          msg: Msg.invalidCread,
        });
      }

      if (userResp[0].status == 0) {
        return res.status(201).send({
          success: false,
          msg: Msg.accountDeactiveated,
        });
      }

      let Password = await userResp[0].password;

      let checkPassword = await bcrypt.compare(password, Password);

      if (!checkPassword) {
        return res.status(201).send({
          success: false,
          msg: Msg.invalidCread,
        });
      }
      const id = { userId: userResp[0].id };
      token = jwt.sign(id, secretKey, { expiresIn: "1h" });

      const lastlogin = new Date();
      let obj = {
        lastlogin: lastlogin,
        contactNumber: number,
      };

      await setLoginStatusByNumber(obj);
    }

    return res.status(200).send({
      success: true,
      msg: Msg.loginSuccesfully,
      token: token,
      roll: userResp[0].roll,
    });
  } catch (error) {
    console.log(error);
    return res.status(201).send({
      success: false,
      msg: Msg.err,
    });
  }
};

export const addAssets = async (req, res) => {
  try {
    const {
      AssetName,
      AssetDetails,
      AssetIdentifier,
      category,
      lockAndUnlock,
      subCategory,
      images,
      status,
      promote,
      coordinates,
    } = req.body;

    if (
      [
        AssetName,
        AssetDetails,
        AssetIdentifier,
        category,
        lockAndUnlock,
        subCategory,
        images,
        status,
        promote,
        coordinates,
      ].some((field) => field?.trim() === "")
    ) {
      return res.status(201).send({
        success: false,
        msg: Msg.allFieldsRequired,
      });
    }

    const { userId } = req.decoded;
    console.log(req.decoded);



    const imgPaths = req.files.map((file) => file.filename);
    console.log(imgPaths);
    if (!imgPaths) {
      return res.status(201).send({
        success: false,
        msg: Msg.imgePath,
      });
    }

    let obj = {
      AssetName,
      AssetDetails,
      AssetIdentifier,
      category,
      lockAndUnlock,
      subCategory,
      status,
      promote,
      coordinates,
      userId,
    };

    addDataInAssets(obj);

    const assetResp = await fetchUserAssetsById(userId);
    const assetId = assetResp[0].id;
    console.log(assetResp);
    const formattedData = imgPaths.map((imgPath) => {
      let obj = {
        images: imgPath,
        assetId,
        userId,
      };

      addAssetImges(obj);
    });
    await Promise.all(formattedData);

    return res.status(200).json({ success: true, msg: Msg.assetAdded });
  } catch (error) {
    console.log(error);
    return res.status(201).send({
      status: false,
      msg: Msg.err,
    });
  }
};

export const updateUserAssetDetails = async (req, res) => {
  try {
    const { userId } = req.decoded;
    const { id } = req.query;

    const {
      AssetName,
      AssetDetails,
      AssetIdentifier,
      category,
      lockAndUnlock,
      subCategory,
      status,
      promote,
      coordinates,
    } = req.body;

    console.log(req.body);

    const existingAssets = await fetchUserAssetsById(userId);

    if (existingAssets[0].userId !== userId) {
      return res.status(403).json({ success: false, msg: "Unauthorized" });
    }

    const updatedAsset = {
      AssetName: AssetName || existingAssets[0].AssetName,
      AssetDetails: AssetDetails || existingAssets[0].AssetDetails,
      AssetIdentifier: AssetIdentifier || existingAssets[0].AssetIdentifier,
      category: category || existingAssets[0].category,
      lockAndUnlock: lockAndUnlock || existingAssets[0].lockAndUnlock,
      subCategory: subCategory || existingAssets[0].subCategory,
      status: status || existingAssets[0].status,
      promote: promote || existingAssets[0].promote,
      coordinates: coordinates || existingAssets[0].coordinates,
    };

    console.log(updatedAsset);
    console.log(id);

    try {
      await updateAssetDetails(updatedAsset, id);
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(201).send({
      success: false,
      msg: Msg.err,
    });
  }
};

export const getAssetDetails = async (req, res) => {
  try {
    const { userId } = req.decoded;

    const resp = await fetchUserAssetsById(userId);
    const assetResp = await fetchUserAssetsImagesById(userId);

    const mergedAssets = resp.map((asset) => {
      const images = assetResp
        .filter((img) => img.assetId === asset.id)
        .map((img) => ({
          id: img.id,
          images: `${base_url}/temp/${img.images}`, // Concatenate base URL with image name
          userId: img.userId,
          assetId: img.assetId,
        }));
      return {
        ...asset,
        images,
      };
    });

    return res.status(200).json({ success: true, data: mergedAssets });
  } catch (error) {
    return res.status(201).send({
      success: false,
      msg: Msg.err,
    });
  }
};

export const getAssetsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const assets = await fetchAssetsByCategory(category);
    const assetImagesResp = await assetImages();
    console.log(assetImagesResp)
    // console.log(assetImgResp);

    const assetsWithImages = assets.map((asset) => {
      const images = assetImagesResp
            .filter((img) => img.assetId === asset.id)
            .map((img) => ({
              id: img.id,
              images: `${base_url}/temp/${img.images}`, 
              userId: img.userId,
              assetId: img.assetId,
            }));
      return {
        ...asset,
        images,
      };
    });

    return res.status(200).json({ success: true, data: assetsWithImages });
  } catch (error) {
    return res.status(201).send({
      success: false,
      msg: Msg.err,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { userId } = req.decoded;
    const { name, dp } = req.body;

    const imagPath = req.file.filename;

    if (name) {
      try {
        await updateProfileName(name, userId);
      } catch (error) {
        console.log(error);
        return res.status(201).json({
          success: false,
          msg: Msg.errorUpdatingName,
        });
      }
    }

    if (imagPath) {
      let obj = {
        dp: imagPath,
        userId,
      };
      console.log(obj);
      try {
        await updateProfileDp(obj);
      } catch (error) {
        console.log(error);
        return res.status(201).json({
          success: false,
          msg: Msg.errorUpdatingDp,
        });
      }
    } else {
      return res.status(201).json({
        success: false,
        msg: Msg.imgIsNotAvailable,
      });
    }

    return res.status(200).json({
      success: true,
      msg: Msg.profileUpdated,
    });
  } catch (error) {
    return res.status(201).send({
      success: false,
      msg: Msg.err,
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.decoded;
    try {
      await deleteUserById(userId);
      await deleteAssetsImagesByUserId(userId);
      await deleteAssetsByUserId(userId);
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        success: true,
        msg: Msg.errorInDeletingProfile,
      });
    }

    return res.status(200).json({
      success: true,
      msg: Msg.profileDeleted,
    });
  } catch (error) {
    console.log(error);
    return res.status(201).send({
      success: false,
      msg: Msg.err,
    });
  }
};


export const getCategoryList = async(req, res)=>{
  try {
    const resp = await getCategoriesList();
    const filteredResp = resp.map(({ id, categoryName }) => ({
      id,
      categoryName,
    }));
    return res.status(200).json(filteredResp);

    
  } catch (error) {
    console.log(error);
    return res.status(201).send({
      success: false,
      msg: Msg.err,
    });
    
  }
}



export const addCategories = async(req, res)=>{
  try {
    const {categoryName, categoryImage} = req.body
    const imgPath = req.file.filename
    let obj = {
      categoryName,
      categoryImage: imgPath
    }
    
    await insertCategories(obj)
    return res.status(201).send({
      success: true,
   
    });
  } catch (error) {
    console.log(error);
    return res.status(201).send({
      success: false,
      msg: Msg.err,
    });
    
    
  }

}



export const allCategoriesAndCount= async(req, res)=>{
  try {
    const categoryList = await getCategoriesList()


    const categoryDetails = await Promise.all(
      categoryList.map(async (category) => {
        const assetsCount = await getAssetsCountByCategory(category.id);
        return {
          id: category.id,
          categoryName: category.categoryName,
          categoryImage: `${base_url}/temp/${category.categoryImage}` ,
          totalItems: assetsCount,
        };
      })
    );

    console.log(categoryDetails);
    return res.status(200).json({success: true, categoryDetails});
     
    
  } catch (error) {
    console.log(error);
    return res.status(201).send({
      success: false,
      msg: Msg.err,
    });
    
  }

}