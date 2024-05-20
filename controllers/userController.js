// Import necessary modules and dependencies
import "dotenv/config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Msg from "../helpers/message.js";
import { mail } from "../helpers/emailOtp.js";
import { base_url } from "../config.js";
import twilio from "twilio"
const secretKey = process.env.JWT_SECRET_KEY;

import { hashPassword, generateOTP } from "../helpers/middleware.js";
import {
  fetchUserByEmail,
  fetchUserByNumber,
  fetchAssetsById,
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
  fetchUserById,
  addAssetImges,
  fetchAssetsByCategory,
  assetImages,
  updateProfileName,
  updateProfileDp,
  updateProfileNotes,
  updateProfileNameStatus,
  updateHidStatusOfAsset,
  updateAssetLockedAndUnlocked,
  updateFavourite,
  deleteAssetsByUserId,
  deleteAssetsImagesByUserId,
  deleteAssetsById,
  deleteAssetsImagesByAssetId,
  deleteUserById,
  deleteAssetsImagesById,
  insertCategories,
  getCategoriesList,
  getAssetsCountByCategory,
  getSubCategories,
  getCategoriesById,
  getSubCategoriesById,
  getActiveListingCount,
  getUsersFavouriteAssets

} from "../models/user.model.js";
import { body } from "express-validator";


// const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
// const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
// const twilioPhoneNumber = process.env.TWILIO_PHONENUMBER

// const twilioClient = new twilio(twilioAccountSid, twilioAuthToken)

export const registerUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userResp = await fetchUserByEmail(email);

    if (userResp.length > 0) {
      return res.status(400).send({
        success: false,
        msg: Msg.emailExists
      });
    }
    const otp = await generateOTP();
    await mail(email, otp);
    let obj = {
      email,
      otp
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

export const registerUserByNumber = async (req, res) => {
  try {
    const { number } = req.body;
    const userResp = await fetchUserByNumber(number);

    if (userResp.length > 0) {
      return res.status(400).send({
        success: false,
        msg: Msg.numberExists
      });
    }
    const otp = await generateOTP();
    let obj = {
      contactNumber: number,
      otp
    };

//  try {
//      await twilioClient.messages.create({
//         body: `Your OTP is: ${otp}`,
//         to: number,
//         from: twilioPhoneNumber
//      })
//  } catch (error) {
//   console.log(error);
  
//  }

  await userRegister(obj);

    return res
      .status(200)
      .json({ success: true, message: Msg.otpSent, data: otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ success: false, message: Msg.err });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp, number } = req.body;
  console.log("number", number);

  try {
    if (email) {
      const user = await fetchUserByEmail(email);
      console.log(user)
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: Msg.inValidEmail });
      }
      if (user[0].otp !== otp) {
        return res
          .status(400)
          .json({ success: false, message: Msg.invalidOtp });
      }
      let obj = {
        email,
        isVerified: 1
      };
      await updateUserOtpToVerifiedByEmail(obj);
    } else {
      const userByNumber = await fetchUserByNumber(number);
      console.log("user by number:", userByNumber)
      if (userByNumber.length <= 0) {
        return res
          .status(400)
          .json({ success: false, message: Msg.inValidNumber });
      }
      if (userByNumber[0].otp !== otp) {
        return res
          .status(400)
          .json({ success: false, message: Msg.invalidOtp });
      }
      let obj = {
        contactNumber: number,
        isVerified: 1
      };
      await updateUserOtpToVerifiedByNumber(obj);
    }

    return res.status(200).json({ success: true, message: Msg.otpMatched });
  } catch (error) {
    console.error(":", error);
    return res
      .status(500)
      .json({ success: false, message: Msg.err });
  }
};

export const setPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword, number } = req.body;
    if (email) {
      const userResp = await fetchUserByEmail(email);

      if (userResp[0].isVerified == 0) {
        return res.status(400).send({
          success: false,
          msg: Msg.notVerifyAccount
        });
      }

      if (userResp.length == 0) {
        return res.status(400).send({
          success: false,
          msg: Msg.inValidEmail
        });
      }

      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ success: false, message: Msg.pwdNotMatch });
      }

      const Password = await hashPassword(password);
      let obj = {
        password: Password,
        email
      };
      updatePasswordByEmail(obj);
    } else {
      const userResp = await fetchUserByNumber(number);

      if (userResp[0].isVerified == 0) {
        return res.status(400).send({
          success: false,
          msg: Msg.notVerifyAccount
        });
      }

      if (userResp.length == 0) {
        return res.status(400).send({
          success: false,
          msg: Msg.inValidEmail
        });
      }

      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ success: false, message: Msg.pwdNotMatch });
      }

      const Password = await hashPassword(password);
      let obj = {
        password: Password,
        contactNumber: number
      };
      updatePasswordByNumber(obj);
    }

    return res.status(200).json({ success: true, message: Msg.signUpSuccess });
  } catch (error) {
    console.error(":", error);
    return res
      .status(500)
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
        return res.status(400).send({
          success: false,
          msg: Msg.allFieldsRequired
        });
      }
      userResp = await fetchUserByEmail(email);
      if (userResp.length == 0) {
        return res.status(400).send({
          success: false,
          msg: Msg.inValidEmail
        });
      }

      if (userResp[0].email !== email) {
        return res.status(400).send({
          success: false,
          msg: Msg.invalidCread
        });
      }

      if (userResp[0].status == 0) {
        return res.status(400).send({
          success: false,
          msg: Msg.accountDeactiveated
        });
      }

      let Password = await userResp[0].password;

      let checkPassword = await bcrypt.compare(password, Password);

      if (!checkPassword) {
        return res.status(400).send({
          success: false,
          msg: Msg.invalidCread
        });
      }
      const id = { userId: userResp[0].id };
      token = jwt.sign(id, secretKey, { expiresIn: "1d" });

      const lastlogin = new Date();
      let obj = {
        lastlogin,
        email
      };

      await setLoginStatus(obj);
    } else {
      if (!number || !password) {
        return res.status(400).send({
          success: false,
          msg: Msg.allFieldsRequired
        });
      }
      userResp = await fetchUserByNumber(number);
      if (userResp.length == 0) {
        return res.status(400).send({
          success: false,
          msg: Msg.inValidNumber
        });
      }

      if (userResp[0].contactNumber !== number) {
        return res.success(400).send({
          success: false,
          msg: Msg.invalidCread
        });
      }

      if (userResp[0].status == 0) {
        return res.status(400).send({
          success: false,
          msg: Msg.accountDeactiveated
        });
      }

      let Password = await userResp[0].password;

      let checkPassword = await bcrypt.compare(password, Password);

      if (!checkPassword) {
        return res.status(400).send({
          success: false,
          msg: Msg.invalidCread
        });
      }
      const id = { userId: userResp[0].id };
      token = jwt.sign(id, secretKey, { expiresIn: "1h" });

      const lastlogin = new Date();
      let obj = {
        lastlogin: lastlogin,
        contactNumber: number
      };

      await setLoginStatusByNumber(obj);
    }

    return res.status(200).send({
      success: true,
      msg: Msg.loginSuccesfully,
      token: token,
      roll: userResp[0].roll
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      msg: Msg.err
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
      coordinates
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
        coordinates
      ].some((field) => field?.trim() === "")
    ) {
      return res.status(400).send({
        success: false,
        msg: Msg.allFieldsRequired
      });
    }

    const { userId } = req.decoded;
    console.log(req.decoded);

    const imgPaths = req.files.map((file) => file.filename);
    console.log(imgPaths);
    if (!imgPaths) {
      return res.status(400).send({
        success: false,
        msg: Msg.imgePath
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
      userId
    };

    addDataInAssets(obj);

    const assetResp = await fetchUserAssetsById(userId);
    const assetId = assetResp[assetResp.length - 1].id;
    console.log(assetResp);
    const formattedData = imgPaths.map((imgPath) => {
      let obj = {
        images: imgPath,
        assetId,
        userId
      };

      addAssetImges(obj);
    });
    await Promise.all(formattedData);

    return res.status(200).json({ success: true, msg: Msg.assetAdded });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      msg: Msg.err
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
      imgId
    } = req.body;

    //console.log(req.body);
    const existingAssets = await fetchAssetsById(id);
    if (existingAssets.length <= 0) {
      return res
        .status(403)
        .json({ success: false, msg: "assets does not exists" });
    }

    console.log(existingAssets[0].AssetName);

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
      coordinates: coordinates || existingAssets[0].coordinates
    };

    try {
      await updateAssetDetails(updatedAsset, id);
    } catch (error) {
      console.log(error);
    }

    try {
      const imgPaths = req.files.map((file) => file.filename);
      console.log(imgPaths);
      if (imgPaths) {
        const formattedData = imgPaths.map((imgPath) => {
          let obj = {
            images: imgPath,
            assetId: id,
            userId
          };

          addAssetImges(obj);
        });
        await Promise.all(formattedData);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      if (imgId) {
        await deleteAssetsImagesById(imgId);
      }
    } catch (error) {
      console.log(error);
    }

    return res.status(200).json({ success: true, msg: Msg.assetUpdated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const getAssetDetails = async (req, res) => {
  try {
    const { userId } = req.decoded;

    const resp = await fetchUserAssetsById(userId);
    const assetResp = await fetchUserAssetsImagesById(userId);

    const mergedAssets = [];
    for (const asset of resp) {
      const images = assetResp
        .filter((img) => img.assetId === asset.id)
        .map((img) => ({
          id: img.id,
          images: `${base_url}/temp/${img.images}`, // Concatenate base URL with image name
          userId: img.userId,
          assetId: img.assetId
        }));

      const createdAt = new Date(asset.createdAt);
      const monthYear = `${createdAt.toLocaleString("default", {
        month: "short"
      })} ${createdAt.getFullYear()}`;

      // Fetch category name based on category ID
      const category = await getCategoriesById(asset.category);
      const subCategory = await getSubCategoriesById(asset.subCategory);

      mergedAssets.push({
        ...asset,
        createdAt: monthYear,
        category: category[0].categoryName,
        subCategory: subCategory[0].subCategory,
        images
      });
    }

    return res.status(200).json({ success: true, data: mergedAssets });
  } catch (error) {
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const addAssetToFavourite = async (req, res) => {
  try {
    const  {userId} = req.decoded
    const { assetId } = req.body;
    let obj ={
      userId,
      assetId
    }
    try {
      await updateFavourite(obj);
    } catch (error) {
      console.log(error);
    }
    return res.status(200).send({
      success: true,
      msg: "asset added to favourites "
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const getFavouriteAssets = async (req, res) => {
  try {
    const { userId } = req.decoded;
 
    const  favouriteAssets = await getUsersFavouriteAssets(userId)

    // const resp = await fetchUserAssetsById(userId);
    // const assetResp = await fetchUserAssetsImagesById(userId);

    // const mergedAssets = [];
    // for (const asset of resp) {
    //   const images = assetResp
    //     .filter((img) => img.assetId === asset.id)
    //     .map((img) => ({
    //       id: img.id,
    //       images: `${base_url}/temp/${img.images}`, // Concatenate base URL with image name
    //       userId: img.userId,
    //       assetId: img.assetId
    //     }));

    //   const createdAt = new Date(asset.createdAt);
    //   const monthYear = `${createdAt.toLocaleString("default", {
    //     month: "short"
    //   })} ${createdAt.getFullYear()}`;

    //   // Fetch category name based on category ID
    //   const category = await getCategoriesById(asset.category);
    //   const subCategory = await getSubCategoriesById(asset.subCategory);

    //   //const favourite = asset.favourite === 1;

    //   mergedAssets.push({
    //     ...asset,
    //     createdAt: monthYear,
    //     category: category[0].categoryName,
    //     subCategory: subCategory[0].subCategory,
    //     images,
    //     favourite: asset.favourite // Include the favourite property in the response
    //   });
    // }

    // // Filter assets where favourite is true
    // const favouriteAssets = mergedAssets.filter(
    //   (asset) => asset.favourite == 1
    // );

    return res.status(200).json({ success: true, data: favouriteAssets });
  } catch (error) {
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const getAssetsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const assets = await fetchAssetsByCategory(category);
    if (assets.length <= 0) {
      return res.status(400).json({
        success: false,
        msg: Msg.catgoryExists
      });
    }

    const assetImagesResp = await assetImages();
    // Fetch category name based on category ID
    const categoryDetails = await getCategoriesById(category);
    const subCategoryDetails = await getSubCategoriesById(
      assets[0].subCategory
    );

    const assetsWithImages = assets.map((asset) => {
      const images = assetImagesResp
        .filter((img) => img.assetId === asset.id)
        .map((img) => ({
          id: img.id,
          images: `${base_url}/temp/${img.images}`,
          userId: img.userId,
          assetId: img.assetId
        }));

      const createdAt = new Date(asset.createdAt);
      const monthYear = `${createdAt.toLocaleString("default", {
        month: "short"
      })} ${createdAt.getFullYear()}`;

      return {
        ...asset,
        createdAt: monthYear,
        category: categoryDetails[0].categoryName,
        subCategory: subCategoryDetails[0].subCategory,
        images
      };
    });

    return res.status(200).json({ success: true, data: assetsWithImages });
  } catch (error) {
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.decoded;
    const userResp = await fetchUserById(userId);
    const listingCount = await getActiveListingCount(userId);

    const formattedLastLogin = new Date(userResp[0].createdAt);
    const monthYear = `${formattedLastLogin.toLocaleString("default", {
      month: "long"
    })} ${formattedLastLogin.getFullYear()}`;

    const { password, isVerified, otp, ...filteredUserResp } = userResp[0];

    filteredUserResp.lastlogin = monthYear;
    filteredUserResp.createdAt = monthYear
    filteredUserResp.updatedAt = monthYear
    filteredUserResp.dp = `${base_url}/temp/${filteredUserResp.dp}`
    filteredUserResp.activeListing = listingCount
    console.log(filteredUserResp)


    return res.status(200).json({
      success: true,
      msg: filteredUserResp
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};
export const editProfile = async (req, res) => {
  try {
    const { userId } = req.decoded;
    const { name, dp, notes, nameStatus } = req.body;

    let imagPath;
    if (req.file) {
      imagPath = req.file.filename;
    }

    // console.log(imagPath)

    if (name) {
      try {
        await updateProfileName(name, userId);
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          success: false,
          msg: Msg.errorUpdatingName
        });
      }
    }

    if (imagPath) {
      let obj = {
        dp: imagPath,
        userId
      };
      console.log(obj);
      try {
        await updateProfileDp(obj);
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          success: false,
          msg: Msg.errorUpdatingDp
        });
      }
    }

    if (notes) {
      try {
        await updateProfileNotes(userId, notes);
      } catch (error) {
        console.log(error);
      }
    }

    if (nameStatus) {
      try {
        await updateProfileNameStatus(userId, nameStatus);
      } catch (error) {
        console.log(error);
      }
    }

    return res.status(200).json({
      success: true,
      msg: Msg.profileUpdated
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const setLockedAndUnlockedStatus = async (req, res) => {
  try {
    const { status, id } = req.body;

    const asset = await fetchAssetsById(id);
    if (asset.length <= 0) {
      return res.status(400).send({
        success: false,
        msg: Msg.assetExists
      });
    }

    await updateAssetLockedAndUnlocked(status, id);
    return res.status(200).send({
      success: true,
      msg: `${status} asset successfully `
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const deleteUserAsset = async (req, res) => {
  try {
    const { id } = req.body;
    const asset = await fetchAssetsById(id);
    if (asset.length <= 0) {
      return res.status(400).send({
        success: false,
        msg: Msg.assetExists
      });
    }

    await deleteAssetsById(id);

    await deleteAssetsImagesByAssetId(id);

    return res.status(200).json({
      success: true,
      msg: Msg.assetDeleted
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.decoded;
    const user = await fetchUserById(userId);
    if (user.length <= 0) {
      return res.status(400).send({
        success: false,
        msg: Msg.userNotFound
      });
    }
    try {
      await deleteUserById(userId);
      await deleteAssetsImagesByUserId(userId);
      await deleteAssetsByUserId(userId);
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        success: true,
        msg: Msg.errorInDeletingProfile
      });
    }

    return res.status(200).json({
      success: true,
      msg: Msg.profileDeleted
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const getCategoryList = async (req, res) => {
  try {
    const resp = await getCategoriesList();
    const filteredResp = resp.map(({ id, categoryName }) => ({
      id,
      categoryName
    }));
    return res.status(200).json(filteredResp);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const getSubCategoriesListById = async (req, res) => {
  try {
    const { id } = req.query;
    const category = await getCategoriesById(id);
    if (category.length <= 0) {
      return res.status(400).send({
        success: true,
        msg: Msg.catgoryExists
      });
    }

    const subCategory = await getSubCategories(id);

    return res.status(200).send({
      success: true,
      msg: subCategory
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const allCategoriesAndCount = async (req, res) => {
  try {
    const categoryList = await getCategoriesList();

    const categoryDetails = await Promise.all(
      categoryList.map(async (category) => {
        const assetsCount = await getAssetsCountByCategory(category.id);
        return {
          id: category.id,
          categoryName: category.categoryName,
          categoryImage: `${base_url}/temp/${category.categoryImage}`,
          totalItems: assetsCount
        };
      })
    );

    console.log(categoryDetails);
    return res.status(200).json({ success: true, categoryDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const setAssetHideStatus = async (req, res) => {
  try {
    const { status, id } = req.body;
    const asset = await fetchAssetsById(id);

    if (asset.length <= 0) {
      return res.status(400).send({
        success: false,
        msg: Msg.assetExists
      });
    }
    try {
      await updateHidStatusOfAsset(id, status);
    } catch (error) {
      console.log(error);
    }
    return res.status(200).json({
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const addCategories = async (req, res) => {
  try {
    const { categoryName, categoryImage } = req.body;
    const imgPath = req.file.filename;
    let obj = {
      categoryName,
      categoryImage: imgPath
    };

    await insertCategories(obj);
    return res.status(200).send({
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};

export const addSubCategories = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      msg: Msg.err
    });
  }
};
