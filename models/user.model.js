import db from "../utils/db.js";

export const  userRegister = async (userData) => {
  return db.query("INSERT INTO users SET ?", [userData]);
};


export const  addAssetImges = async (data) => {
  return db.query("INSERT INTO assetimages  SET ?", [data]);
};

export const  fetchUserByEmail = async (email) => {
  return db.query(`SELECT * FROM users WHERE email = '${email}'`);
};


export const  fetchUserAssetsById = async (userId) => {
  return db.query(`SELECT * FROM assets WHERE userId = '${userId}'`);
};

export const  fetchUserAssetsImagesById = async (id) => {
  return db.query(`SELECT * FROM assetimages  WHERE userId = '${id}'`);
};

export const  fetchUserByNumber = async (number) => {
  return db.query(`SELECT * FROM users WHERE contactNumber = '${number}'`);
};

export const  updateUserOtpToVerifiedByEmail = async (obj) => {
  return db.query(
    "UPDATE users SET otp = NULL, isVerified = ? WHERE email = ?",
    [obj.isVerified, obj.email]
  );
};

export const  updateUserOtpToVerifiedByNumber = async (obj) => {
  return db.query(
    "UPDATE users SET otp = NULL, isVerified = ? WHERE contactNumber = ?",  
    [obj.isVerified, obj.contactNumber]
  );
};

export const  updatePasswordByEmail = async (obj) => {
  return db.query("UPDATE users SET password = ? WHERE email = ?", [
    obj.password,
    obj.email,
  ]);
};



export const  updatePasswordByNumber = async (obj) => {
  return db.query("UPDATE users SET password = ? WHERE contactNumber = ?", [
    obj.password,
    obj.contactNumber,
  ]);
};

export const  setLoginStatus = async (obj) => {
  return db.query("UPDATE users SET lastlogin = ? WHERE email = ?", [
    obj.lastlogin,
    obj.email,
  ]);
};

export const  setLoginStatusByNumber = async (obj) => {
  return db.query("UPDATE users SET lastlogin = ? WHERE contactNumber = ?", [ 
    obj.lastlogin,
    obj.contactNumber,
  ]);
};


export const updateAssetDetails = async(assetData, id)=>{
 return db.query("UPDATE  assets SET ? WHERE id = ?", [
  assetData,
    id,
  ]);
}


export const assetImages = async()=>{
  return db.query(`select * from assetimages`);
 }



export const addDataInAssets= async(obj)=>{
  return db.query(`insert into assets set ?`, [obj]);

}


export const  fetchAssetsByCategory = async (category ) => {
  return db.query(`SELECT * FROM assets WHERE category  = '${category}'`);
};

export const updateProfileName = async (userId, name) => {
  return db.query(`UPDATE users SET name = ? WHERE id = ?`, [userId, name]);
};


export const updateProfileDp= async (obj) => {
  return db.query(`UPDATE users SET dp = ? WHERE id = ?`, [obj.dp, obj.userId])
};


export const deleteUserById = async(id)=>{
   return db.query(`DELETE FROM users  WHERE id = ?`, [id])
  
}


export const deleteAssetsByUserId = async(userId)=>{
  return db.query(`DELETE FROM assets  WHERE userId = ?`, [userId])
 
}


export const deleteAssetsImagesByUserId = async(userId)=>{
  return db.query(`DELETE FROM assetimages  WHERE userId = ?`, [userId])
 
}



export const insertCategories= async(obj)=>{
  return db.query(`insert into categories set ?`, [obj]);

}



export const getCategoriesList= async()=>{
  return db.query(`select * from categories`);

}



export const getAssetsCountByCategory = async (categoryId) => {
    const count = await db.query("SELECT COUNT(*) AS count FROM assets WHERE category = ?", [categoryId]);
    return count[0].count || 0;
 
};



