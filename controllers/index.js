import {
  registerUserByEmail,
  registerUserByNumber,
  verifyOtp,
  setPassword,
  userLogin,
  addAssets,
  updateUserAssetDetails,
  getAssetDetails,
  getAssetsByCategory,
  editProfile,
  deleteUnverfiedUsers,
  getCategoryList,
  allCategoriesAndCount,
  setLockedAndUnlockedStatus,
  deleteUserAsset,
  setAssetHideStatus,
  getSubCategoriesListById,
  addAssetToFavourite,
  getFavouriteAssets,
  getProfile,
  getAllAssetDetails,
  getUserProfileAndAssets,
  randomAssetDetails,
  sendOtpForPasswordVerfiy,
} from "./userController.js";

export const userController = {
  registerUserByEmail,
  registerUserByNumber,
  verifyOtp,
  setPassword,
  userLogin,
  addAssets,
  updateUserAssetDetails,
  getAssetDetails,
  getAssetsByCategory,
  editProfile,
  deleteUnverfiedUsers,
  getCategoryList,
  allCategoriesAndCount,
  setLockedAndUnlockedStatus,
  sendOtpForPasswordVerfiy,
  deleteUserAsset,
  setAssetHideStatus,
  getSubCategoriesListById,
  addAssetToFavourite,
  getFavouriteAssets,
  getProfile,
  getAllAssetDetails,
  getUserProfileAndAssets,
  randomAssetDetails,
};

import { sendMessage } from "./chatController.js";
export const chatController = {
  sendMessage,
};

import {
  addCategories,
  addSubCategories,
  getAllUsers,
  getAllLatestUsers,
  getAllCategoryList
} from "../controllers/adminController.js";

export const adminController = {
  addCategories,
  addSubCategories,
  getAllUsers,
  getAllLatestUsers,
  getAllCategoryList
};
