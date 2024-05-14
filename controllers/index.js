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
  deleteProfile,
  addCategories,
  getCategoryList,
  allCategoriesAndCount
  
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
    deleteProfile,
    addCategories,
    getCategoryList,
    allCategoriesAndCount
};

