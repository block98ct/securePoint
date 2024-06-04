// Import necessary modules and dependencies
import "dotenv/config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Msg from "../helpers/message.js";
import { mail } from "../helpers/emailOtp.js";
import fs from "fs";
import { base_url } from "../config.js";
// import twilio from "twilio";

import { paginate } from "../utils/pagination.js";
const secretKey = process.env.JWT_SECRET_KEY;

import { hashPassword, generateOTP } from "../helpers/middleware.js";
import {
  fetchUserByEmail,
  removeFavourite,
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
  fetchAssetsByCategory,
  fetchAssetImagesByAssetIds,
  fetchAllUserAssetsImages,
  fetchAllUserAssets,
  fetchAllUsers,
  addAssetImges,
  assetImages,
  updateProfileName,
  updateProfileDp, 
  updateProfileNotes,
  updateProfileNameStatus,
  updateHidStatusOfAsset,
  updateAssetLockedAndUnlocked,
  updateFavourite,
  deleteAssetsImagesByUserId,
  deleteAssetsById,
  deleteAssetsImagesByAssetId,
  deleteUserById,
  deleteAssetsImagesById,
  getCategoriesList,
  getAssetsCountByCategory,
  getSubCategories,
  getCategoriesById,
  getSubCategoriesById,
  getActiveListingCount,
  getUsersFavouriteAssetsByUserId,
  getFavouriteAssetsByUserIdAndAssetId,
} from "../models/user.model.js";

// const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
// const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
// const twilioPhoneNumber = process.env.TWILIO_PHONENUMBER

// const twilioClient = new twilio(twilioAccountSid, twilioAuthToken)

// UTLITY FUNCTION FOR SEARCH ASSETS
export const filterAssets = (req, assets, filters) => {
  const { AssetName, AssetDetails, category, subCategory, status, promote } =
    filters;

  return assets.filter((asset) => {
    let matches = true;

    if (AssetName && !asset.AssetName.includes(AssetName)) {
      matches = false;
    }
    if (AssetDetails && !asset.AssetDetails.includes(AssetDetails)) {
      matches = false;
    }
    // const lockAndUnlock = req.query.lockAndUnlock ? parseInt(req.query.lockAndUnlock, 10) : undefined;
    //  console.log("lockAndUnlock------>", lockAndUnlock)
    //  console.log("asset.lockAndUnlock------>", asset.lockAndUnlock);
    //  console.log(lockAndUnlock && asset.lockAndUnlock !== lockAndUnlock);

    // if (lockAndUnlocked !== undefined && asset.lockAndUnlocked !== lockAndUnlocked) {
    //   matches = false;
    // }

    if (category && asset.categoryName !== category) {
      matches = false;
    }
    if (subCategory && asset.subCategoryName !== subCategory) {
      matches = false;
    }
    if (status && asset.status !== status) {
      matches = false;
    }
    if (promote && asset.promote !== promote) {
      matches = false;
    }

    return matches;
  });
};


export const registerUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userResp = await fetchUserByEmail(email);

    if (userResp.length > 0) {
      return res.status(400).send({
        success: false,
        message: Msg.emailExists,
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

export const registerUserByNumber = async (req, res) => {
  try {
    const { number } = req.body;
    const userResp = await fetchUserByNumber(number);

    if (userResp.length > 0) {
      return res.status(400).send({
        success: false,
        message: Msg.numberExists,
      });
    }
    const otp = await generateOTP();
    let obj = {
      contactNumber: number,
      otp,
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
      console.log(user);
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
        isVerified: 1,
      };
      await updateUserOtpToVerifiedByEmail(obj);
    } else {
      const userByNumber = await fetchUserByNumber(number);
      console.log("user by number:", userByNumber);
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
        isVerified: 1,
      };
      await updateUserOtpToVerifiedByNumber(obj);
    }

    return res.status(200).json({ success: true, message: Msg.otpMatched });
  } catch (error) {
    console.error(":", error);
    return res.status(500).json({ success: false, message: Msg.err });
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
          message: Msg.notVerifyAccount,
        });
      }

      if (userResp.length == 0) {
        return res.status(400).send({
          success: false,
          message: Msg.inValidEmail,
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
        email,
      };
      updatePasswordByEmail(obj);
    } else {
      const userResp = await fetchUserByNumber(number);

      if (userResp[0].isVerified == 0) {
        return res.status(400).send({
          success: false,
          message: Msg.notVerifyAccount,
        });
      }

      if (userResp.length == 0) {
        return res.status(400).send({
          success: false,
          message: Msg.inValidEmail,
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
        contactNumber: number,
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
          message: Msg.allFieldsRequired,
        });
      }
      userResp = await fetchUserByEmail(email?.toLowerCase());
      if (userResp.length == 0) {
        return res.status(400).send({
          success: false,
          message: Msg.inValidEmail,
        });
      }

      if (userResp[0].email.toLowerCase() !== email?.toLowerCase()) {
        return res.status(400).send({
          success: false,
          message: Msg.invalidCread,
        });
      }

      if (userResp[0].status == 0) {
        return res.status(400).send({
          success: false,
          message: Msg.accountDeactiveated,
        });
      }

      let Password = await userResp[0].password;

      let checkPassword = await bcrypt.compare(password, Password);
      console.log(checkPassword);

      if (!checkPassword) {
        return res.status(400).send({
          success: false,
          message: Msg.invalidCread,
        });
      }
      const id = { userId: userResp[0].id };
      token = jwt.sign(id, secretKey, { expiresIn: "1d" });

      const lastlogin = new Date();
      let obj = {
        lastlogin,
        email,
      };

      await setLoginStatus(obj);
    } else {
      if (!number || !password) {
        return res.status(400).send({
          success: false,
          message: Msg.allFieldsRequired,
        });
      }
      userResp = await fetchUserByNumber(number);
      if (userResp.length == 0) {
        return res.status(400).send({
          success: false,
          message: Msg.inValidNumber,
        });
      }

      if (userResp[0].contactNumber !== number) {
        return res.success(400).send({
          success: false,
          message: Msg.invalidCread,
        });
      }

      if (userResp[0].status == 0) {
        return res.status(400).send({
          success: false,
          message: Msg.accountDeactiveated,
        });
      }

      let Password = await userResp[0].password;

      let checkPassword = await bcrypt.compare(password, Password);

      if (!checkPassword) {
        return res.status(400).send({
          success: false,
          message: Msg.invalidCread,
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
      userId: userResp[0].id,
      success: true,
      message: Msg.loginSuccesfully,
      token: token,
      roll: userResp[0].roll,
    });
    //  return res.status(201)
    //             .json(new ApiResponse(200,{token: token, roll: userResp[0].roll}, Msg.loginSuccesfully ))
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
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
      longitude,
      latitude,
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
        longitude,
        latitude,
      ].some((field) => field?.trim() === "")
    ) {
      return res.status(400).send({
        success: false,
        message: Msg.allFieldsRequired,
      });
    }

    const { userId } = req.decoded;
    console.log(req.decoded);

    const imgPaths = req.files.map((file) => file.filename);
    console.log(imgPaths);
    if (!imgPaths) {
      return res.status(400).send({
        success: false,
        message: Msg.imgePath,
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
      userId,
      longitude,
      latitude,
    };

    addDataInAssets(obj);

    const assetResp = await fetchUserAssetsById(userId);
    const assetId = assetResp[assetResp.length - 1].id;
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
    return res.status(200).send({
      status: true,
      message: Msg.assetAdded,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: Msg.err,
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
      longitude,
      latitude,
      imgId,
    } = req.body;

    //console.log(req.body);
    const existingAssets = await fetchAssetsById(id);
    if (existingAssets.length <= 0) {
      return res
        .status(403)
        .json({ success: false, message: "assets does not exists" });
    }

    console.log(existingAssets[0].AssetName);

    if (existingAssets[0].userId !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
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
      longitude: longitude || existingAssets[0].longitude,
      latitude: latitude || existingAssets[0].latitude,
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
            userId,
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

    return res.status(200).json({ success: true, message: Msg.assetUpdated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
  }
};

export const addAssetToFavourite = async (req, res) => {
  try {
    const { userId } = req.decoded;
    const { assetId, status } = req.body;
    let obj = {
      userId,
      assetId,
    };
    if (status == 1) {
      try {
        await updateFavourite(obj);
        return res.status(200).send({
          success: true,
          message: "asset added to favourites ",
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (status == 0) {
      try {
        await removeFavourite(assetId);
        return res.status(200).send({
          success: true,
          message: "asset remove from favourites ",
        });
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: Msg.err,
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
      month: "long",
    })} ${formattedLastLogin.getFullYear()}`;

    const { password, isVerified, otp, ...filteredUserResp } = userResp[0];

    filteredUserResp.lastlogin = monthYear;
    filteredUserResp.createdAt = monthYear;
    filteredUserResp.updatedAt = monthYear;
    filteredUserResp.dp = `${base_url}/temp/${filteredUserResp.dp}`;
    filteredUserResp.activeListing = listingCount;
    console.log(filteredUserResp);

    return res.status(200).json({
      success: true,
      message: filteredUserResp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
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
    const currentProfile = await fetchUserById(userId);

    // console.log(imagPath)

    if (name) {
      try {
        await updateProfileName(name, userId);
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          success: false,
          message: Msg.errorUpdatingName,
        });
      }
    }

    if (imagPath) {
      let obj = {
        dp: imagPath,
        userId,
      };
      try {
        await updateProfileDp(obj);
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          success: false,
          message: Msg.errorUpdatingDp,
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
      message: Msg.profileUpdated,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
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
        message: Msg.assetExists,
      });
    }

    await updateAssetLockedAndUnlocked(status, id);
    return res.status(200).send({
      success: true,
      message: `${status} asset successfully `,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
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
        message: Msg.assetExists,
      });
    }

    await deleteAssetsById(id);

    await deleteAssetsImagesByAssetId(id);

    return res.status(200).json({
      success: true,
      message: Msg.assetDeleted,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
  }
};

// export const deleteProfile = async (req, res) => {
//   try {
//     const { userId } = req.decoded;
//     const user = await fetchUserById(userId);
//     if (user.length <= 0) {
//       return res.status(400).send({
//         success: false,
//         message: Msg.userNotFound,
//       });
//     }
//     try {
//       await deleteUserById(userId);
//       await deleteAssetsImagesByUserId(userId);
//       await deleteAssetsByUserId(userId);
//       return res.status(200).json({
//         success: true,
//         message: Msg.userDeletd,
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(200).json({
//         success: true,
//         message: Msg.errorInDeletingProfile,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: Msg.profileDeleted,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       success: false,
//       message: Msg.err,
//     });
//   }
// };

export const getCategoryList = async (req, res) => {
  try {
    const resp = await getCategoriesList();
    const filteredResp = resp.map(({ id, categoryName }) => ({
      id,
      categoryName,
    }));
    return res.status(200).json({ success: true, data: filteredResp });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
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
        message: Msg.catgoryExists,
      });
    }

    const subCategory = await getSubCategories(id);

    return res.status(200).send({
      success: true,
      message: subCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Message.err,
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
          totalItems: assetsCount,
        };
      })
    );

    console.log(categoryDetails);
    return res.status(200).json({ success: true, categoryDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
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
        message: Msg.assetExists,
      });
    }
    try {
      await updateHidStatusOfAsset(id, status);
    } catch (error) {
      console.log(error);
    }
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
  }
};

export const setHideStatusOfUserProfile = async (req, res) => {};

// Get ASSETS BY CATEGORY
export const getAssetsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const assets = await fetchAssetsByCategory(category);
    if (assets.length <= 0) {
      return res.status(400).json({
        success: false,
        message: Msg.catgoryExists,
        data: [],
      });
    }

    const assetImagesResp = await assetImages();
    const categoryDetails = await getCategoriesById(category);
    const subCategoryDetails = await getSubCategoriesById(
      assets[0].subCategory
    );

    const assetsWithImagesAndUserDetails = await Promise.all(
      assets.map(async (asset) => {
        const images = assetImagesResp
          .filter((img) => img.assetId === asset.id)
          .map((img) => ({
            id: img.id,
            images: img.images?`${base_url}/temp/${img.images}`: null,
            userId: img.userId,
            assetId: img.assetId,
          }));

        const createdAt = new Date(asset.createdAt);
        const monthYear = `${createdAt.toLocaleString("default", {
          month: "short",
        })} ${createdAt.getFullYear()}`;

        // Fetch user details
        const userDetails = await fetchUserById(asset.userId);

        return {
          ...asset,
          createdAt: monthYear,
          category: categoryDetails[0].categoryName,
          subCategory: subCategoryDetails[0].subCategory,
          images,

          userName: userDetails[0].name,
          userDp: userDetails[0].dp? `${base_url}/temp/${userDetails[0].dp}`: null,
          userCreatedAt: `${new Date(userDetails[0].createdAt).toLocaleString(
            "default",
            {
              month: "short",
            }
          )} ${new Date(userDetails[0].createdAt).getFullYear()}`,
        };
      })
    );

    return res
      .status(200)
      .json({ success: true, data: assetsWithImagesAndUserDetails });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
  }
};


//  GET ALL  ASSET DETAILS
export const getAllAssetDetails = async (req, res) => {
  try {
    const { userId } = req.decoded;
    const resp = await fetchAllUserAssets();
    const assetResp = await fetchAllUserAssetsImages();
    const userResp = await fetchAllUsers(); // Function to fetch all users

    // Create a map of user details for quick lookup
    const userMap = new Map();
    userResp.forEach((user) => {
      userMap.set(user.id, {
        name: user.name,
        dp: user.dp? `${base_url}/temp/${user.dp}` : null,
        createdAt: `${new Date(user.createdAt).toLocaleString("default", {
          month: "short",
        })} ${new Date(user.createdAt).getFullYear()}`,
      });
    });

    const mergedAssets = [];
    for (const asset of resp) {
      const images = assetResp
        .filter((img) => img.assetId === asset.id)
        .map((img) => ({
          id: img.id,
          images: img.images?`${base_url}/temp/${img.images}`: null, // Concatenate base URL with image name
          userId: img.userId,
          assetId: img.assetId,
        }));

      const createdAt = new Date(asset.createdAt);
      const monthYear = `${createdAt.toLocaleString("default", {
        month: "short",
      })} ${createdAt.getFullYear()}`;

      // Fetch category name based on category ID
      const category = await getCategoriesById(asset.category);
      const subCategory = await getSubCategoriesById(asset.subCategory);
      const favouriteAssets = await getFavouriteAssetsByUserIdAndAssetId(
        userId,
        asset.id
      );
      const isFavourite = favouriteAssets.length > 0;

      // Fetch user info from userMap
      const userInfo = userMap.get(asset.userId) || {};

      mergedAssets.push({
        ...asset,
        createdAt: monthYear,
        categoryName: category[0].categoryName,
        subCategoryName: subCategory[0].subCategory,
        favourite: isFavourite ? true : false,
        images,
        // Include user information
        userName: userInfo.name,
        userDp: userInfo.dp ,
        userCreatedAt: userInfo.createdAt, // You can format this date if needed
      });
    }

    const filters = req.query;
    const filteredAssets = filterAssets(req, mergedAssets, filters);

    const page = parseInt(req.query.page) || 1;
    const assetsToPaginate =
      filteredAssets.length > 0 ? filteredAssets : mergedAssets;
    const paginatedAssets = paginate(assetsToPaginate, page);

    return res.status(200).json({
      success: true,
      data: paginatedAssets,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
  }
};

//  GETALL USER ASSET DETAILS
export const getAssetDetails = async (req, res) => {
  try {
    const { userId } = req.decoded;

    const resp = await fetchUserAssetsById(userId);
    const assetResp = await fetchUserAssetsImagesById(userId);
    const userResp = await fetchUserById(userId);

    const userInfo = userResp[0];
    const { name, dp, createdAt } = userInfo;
    const userCreatedAt = new Date(createdAt);
    const userCreatedMonthYear = `${userCreatedAt.toLocaleString("default", {
      month: "short",
    })} ${userCreatedAt.getFullYear()}`;

    const mergedAssets = [];
    for (const asset of resp) {
      const images = assetResp
        .filter((img) => img.assetId === asset.id)
        .map((img) => ({
          id: img.id,
          images: img.images? `${base_url}/temp/${img.images}`: null, // Concatenate base URL with image name
          userId: img.userId,
          assetId: img.assetId,
        }));

      const createdAt = new Date(asset.createdAt);
      const monthYear = `${createdAt.toLocaleString("default", {
        month: "short",
      })} ${createdAt.getFullYear()}`;

      // Fetch category name based on category ID
      const category = await getCategoriesById(asset.category);
      const subCategory = await getSubCategoriesById(asset.subCategory);
      const favouriteAssets = await getFavouriteAssetsByUserIdAndAssetId(
        userId,
        asset.id
      );
      const isFavourite = favouriteAssets.length > 0;

      mergedAssets.push({
        ...asset,
        createdAt: monthYear,
        categoryName: category[0].categoryName,
        subCategoryName: subCategory[0].subCategory,
        favourite: isFavourite ? true : false,
        images,
        // Include user information
        userName: name,
        userDp: dp?`${base_url}/temp/${dp}`: null,
        userCreatedAt: userCreatedMonthYear, // You can format this date if needed
      });
    }

    const filters = req.query;
    const filteredAssets = filterAssets(req, mergedAssets, filters);
    return res.status(200).json({
      success: true,
      data: filteredAssets ? filteredAssets : mergedAssets,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
  }
};

//  GET ALL USER ASSET DETAILS
export const getFavouriteAssets = async (req, res) => {
  try {
    const { userId } = req.decoded;

    const favouriteAssets = await getUsersFavouriteAssetsByUserId(userId);

    const userResp = await fetchUserById(userId);

    const userInfo = userResp[0];
    const { name, dp, createdAt } = userInfo;
    const userCreatedAt = new Date(createdAt);
    const userCreatedMonthYear = `${userCreatedAt.toLocaleString("default", {
      month: "short",
    })} ${userCreatedAt.getFullYear()}`;

    if (favouriteAssets.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const assetIds = favouriteAssets.map((fav) => fav.assetId);
    console.log("assetIds:", assetIds);

    // Fetch the assets and images for the favorite assets
    const [assets, assetImages] = await Promise.all([
      fetchAssetsById(assetIds),
      fetchAssetImagesByAssetIds(assetIds),
    ]);
    console.log("assets:", assets);
    console.log("assetImages:", assetImages);

    // Merge assets with their images
    const mergedAssets = await Promise.all(
      assets.map(async (asset) => {
        const images = assetImages
          .filter((img) => img.assetId === asset.id)
          .map((img) => ({
            id: img.id,
            images: img.images?`${base_url}/temp/${img.images}`: null,
            userId: img.userId,
            assetId: img.assetId,
          }));

        const createdAt = new Date(asset.createdAt);
        const monthYear = `${createdAt.toLocaleString("default", {
          month: "short",
        })} ${createdAt.getFullYear()}`;

        const [category, subCategory] = await Promise.all([
          getCategoriesById(asset.category),
          getSubCategoriesById(asset.subCategory),
        ]);

        return {
          ...asset,
          createdAt: monthYear,
          images,
          category: category[0].categoryName,
          subCategory: subCategory[0].subCategory,
          favourite: true,
          userName: name,
          userDp: dp?`${base_url}/temp/${dp}`: null,
          userCreatedAt: userCreatedMonthYear, // You can format this date if needed
        };
      })
    );

    return res.status(200).json({ success: true, data: mergedAssets });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
  }
};

// export const filterAllAssets = async (req, res) => {
//   try {
//     const assetResp = await fetchAllUserAssets();
//     const assetImgResp = await fetchAllUserAssetsImages();
//     const categoriesResp = await getCategoriesList();
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send({
//       success: false,
//       message: Msg.err,
//     });
//   }
// };

export const getUserProfileAndAssets = async (req, res) => {
  try {
    const { userId } = req.query;

    // Fetch user profile information
    const userResp = await fetchUserById(userId);
    const listingCount = await getActiveListingCount(userId);

    const formattedLastLogin = new Date(userResp[0].createdAt);
    const monthYear = `${formattedLastLogin.toLocaleString("default", {
      month: "long",
    })} ${formattedLastLogin.getFullYear()}`;

    const { password, isVerified, otp, ...filteredUserResp } = userResp[0];

    filteredUserResp.lastlogin = monthYear;
    filteredUserResp.createdAt = monthYear;
    filteredUserResp.updatedAt = monthYear;
    filteredUserResp.dp = filteredUserResp.dp
      ? `${base_url}/temp/${filteredUserResp.dp}`
      : null;
    filteredUserResp.activeListing = listingCount;

    // Fetch user assets and their images
    const resp = await fetchUserAssetsById(userId);
    const assetResp = await fetchUserAssetsImagesById(userId);

    const mergedAssets = [];
    for (const asset of resp) {
      const images = assetResp
        .filter((img) => img.assetId === asset.id)
        .map((img) => ({
          id: img.id,
          images: img.images?`${base_url}/temp/${img.images}`: null, // Concatenate base URL with image name
          userId: img.userId,
          assetId: img.assetId,
        }));

      const createdAt = new Date(asset.createdAt);
      const monthYear = `${createdAt.toLocaleString("default", {
        month: "short",
      })} ${createdAt.getFullYear()}`;

      // Fetch category name based on category ID
      const category = await getCategoriesById(asset.category);
      const subCategory = await getSubCategoriesById(asset.subCategory);
      const favouriteAssets = await getFavouriteAssetsByUserIdAndAssetId(
        userId,
        asset.id
      );
      const isFavourite = favouriteAssets.length > 0;

      mergedAssets.push({
        ...asset,
        createdAt: monthYear,
        categoryName: category[0].categoryName,
        subCategoryName: subCategory[0].subCategory,
        favourite: isFavourite ? true : false,

        images,
      });
    }

    // Apply filters if any
    const filters = req.query;
    const filteredAssets = filterAssets(req, mergedAssets, filters);

    // Combine profile information and assets into a single response object
    return res.status(200).json({
      success: true,
      profile: filteredUserResp,
      assets: filteredAssets ? filteredAssets : mergedAssets,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
  }
};

const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};


export const randomAssetDetails = async (req, res) => {
  try {
    const { userId } = req.decoded;
    const resp = await fetchAllUserAssets();
    const assetResp = await fetchAllUserAssetsImages();
    const userResp = await fetchAllUsers(); // Function to fetch all users

    // Create a map of user details for quick lookup
    const userMap = new Map();
    userResp.forEach((user) => {
      userMap.set(user.id, {
        name: user.name,
        dp: user.dp?`${base_url}/temp/${user.dp}`: null,
        createdAt: `${new Date(user.createdAt).toLocaleString("default", {
          month: "short",
        })} ${new Date(user.createdAt).getFullYear()}`,
      });
    });

    const mergedAssets = [];
    for (const asset of resp) {
      const images = assetResp
        .filter((img) => img.assetId === asset.id)
        .map((img) => ({
          id: img.id,
          images: img.images? `${base_url}/temp/${img.images}`: null, // Concatenate base URL with image name
          userId: img.userId,
          assetId: img.assetId,
        }));

      const createdAt = new Date(asset.createdAt);
      const monthYear = `${createdAt.toLocaleString("default", {
        month: "short",
      })} ${createdAt.getFullYear()}`;

      // Fetch category name based on category ID
      const category = await getCategoriesById(asset.category);
      const subCategory = await getSubCategoriesById(asset.subCategory);
      const favouriteAssets = await getFavouriteAssetsByUserIdAndAssetId(
        userId,
        asset.id
      );
      const isFavourite = favouriteAssets.length > 0;

      // Fetch user info from userMap
      const userInfo = userMap.get(asset.userId) || {};

      mergedAssets.push({
        ...asset,
        createdAt: monthYear,
        categoryName: category[0].categoryName,
        subCategoryName: subCategory[0].subCategory,
        favourite: isFavourite ? true : false,
        images,
        // Include user information
        userName: userInfo.name,
        userDp: userInfo.dp,
        userCreatedAt: userInfo.createdAt, // You can format this date if needed
      });
    }

    // Shuffle the merged assets array to get a random order
    const shuffledAssets = shuffleArray(mergedAssets);

    // Get the first 4 assets from the shuffled array
    const randomAssets = shuffledAssets.slice(0, 4);

    const filters = req.query;
    const filteredAssets = filterAssets(req, randomAssets, filters);

    return res.status(200).json({
      success: true,
      data: filteredAssets.length > 0 ? filteredAssets : randomAssets,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
  }
};



export const deleteUnverfiedUsers= async(req, res)=>{
  try {
    const { number, email} = req.body
    if (number) {
      const userResp = await fetchUserByNumber(number)
      if (userResp.length <= 0) {
        return res.status(200).send({
          success: false,
          message: Msg.userNotFound,
        });
        
      }
      if(userResp[0].isVerified !==0){
        return res.status(200).send({
          success: false,
          message: `Unauthorized action`,
        }); 

      }
      try {
        
        await deleteUserById(userResp[0].id)
      } catch (error) {
        console.log(error);
      }

      
    }

    if (email) {
      const userResp = await fetchUserByEmail(email)

      if (userResp.length <= 0) {
        return res.status(200).send({
          success: false,
          message: Msg.userNotFound,
        });
        
      }
      if(userResp[0].isVerified !==0){
        return res.status(200).send({
          success: false,
          message: `Unauthorized action`,
        });
        

      }
   
      try {
        await deleteUserById(userResp[0].id)
        
      } catch (error) {
        console.log(error);
      }
    }

    return res.status(200).send({
      success: true,
      message: Msg.userDeletd,
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
  }
}
