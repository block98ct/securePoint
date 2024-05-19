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

export const  fetchUserByNumber = async (number) => {
  return db.query(`SELECT * FROM users WHERE contactNumber = '${number}'`);
};


export const  fetchUserById = async (id) => {
  return db.query(`SELECT * FROM users WHERE id = '${id}'`);
};



export const  fetchUserAssetsById = async (userId) => {
  return db.query(`SELECT * FROM assets WHERE userId = '${userId}'`);
};

export const  fetchAssetsById = async (id) => {
  return db.query(`SELECT * FROM assets WHERE id = '${id}'`);
};


export const  fetchUserAssetsImagesById = async (id) => {
  return db.query(`SELECT * FROM assetimages  WHERE userId = '${id}'`);
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

export const  updateFavourite = async(favourite, id)=>{
   return db.query("UPDATE assets SET favourite  = ? WHERE id = ?", [favourite,id])
}


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


export const updateAssetLockedAndUnlocked = async (id, name) => {
  return db.query(`UPDATE assets SET lockAndUnlock = ? WHERE id = ?`, [id, name]);
};

export const updateHidStatusOfAsset = async (id, status) => {
  return db.query(`UPDATE assets SET hideStatus = ? WHERE id = ?`, [status, id]);
};

export const updateProfileDp= async (obj) => {
  return db.query(`UPDATE users SET dp = ? WHERE id = ?`, [obj.dp, obj.userId])
};

export const updateProfileNotes = async (userId, notes) => {
  return db.query(`UPDATE users SET notes = ? WHERE id = ?`, [notes, userId]);
};


export const updateProfileNameStatus = async (userId, status) => {
  return db.query(`UPDATE users SET nameStatus = ? WHERE id = ?`, [status, userId]);
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



export const deleteAssetsById = async(userId)=>{
  return db.query(`DELETE FROM assets  WHERE id = ?`, [userId])
 
}


export const deleteAssetsImagesByAssetId = async(assetId)=>{
  return db.query(`DELETE FROM assetimages  WHERE assetId = ?`, [assetId])
 
}


export const deleteAssetsImagesById = async(id)=>{
  return db.query(`DELETE FROM assetimages  WHERE id = ?`, [id])
 
}



export const insertCategories= async(obj)=>{
  return db.query(`insert into categories set ?`, [obj]);

}



export const getCategoriesList= async()=>{
  return db.query(`select * from categories`);

}

export const getCategoriesById= async(id)=>{
  return db.query(`SELECT * FROM categories WHERE id = '${id}'`);

}




export const getAssetsCountByCategory = async (categoryId) => {
    const count = await db.query("SELECT COUNT(*) AS count FROM assets WHERE category = ?", [categoryId]);
    return count[0].count || 0;
 
};


export const getSubCategories = async(categoryId)=>{
  return db.query(`SELECT * FROM subCategories WHERE categoryId = '${categoryId}'`);


}



export const getSubCategoriesById = async(id)=>{
  return db.query(`SELECT * FROM subCategories WHERE id = '${id}'`);


}




