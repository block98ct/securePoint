const db = require("../utils/db");

module.exports = {

  userRegister: async (userData) => {
    return db.query("insert into users set ?", [userData]);
  },
  fetchUserByEmail: async (email) => {
    return db.query(`select * from users where email = '${email}'`);
  },
  fetchUserByNumber: async (number) => {
    return db.query(`select * from users where contactNumber = '${number}'`);

  },

  updateUserOtpToVerifiedByEmail: async (obj) => {
    return db.query('UPDATE users SET otp = NULL, isVerified = ? WHERE email = ?', [obj.isVerified, obj.email]);
  },

  updateUserOtpToVerifiedByNumber: async (obj) => {
    return db.query('UPDATE users SET otp = NULL, isVerified = ? WHERE contactNumber = ?', [obj.isVerified, obj.contactNumber]);
  },


  updatePasswordByEmail: async (obj) => {
    return db.query('UPDATE users SET password = ? WHERE email = ?', [obj.password, obj.email]);
  },

  updatePasswordByNumber: async (obj) => {
    return db.query('UPDATE users SET password = ? WHERE contactNumber = ?', [obj.password, obj.contactNumber]);
  },


  setLoginStatus: async(obj)=>{
    return db.query('UPDATE users SET lastlogin = ? WHERE email = ?', [obj.lastlogin, obj.email]);

  },


  setLoginStatusByNumber: async(obj)=>{
    return db.query('UPDATE users SET lastlogin = ? WHERE contactNumber = ?', [obj.lastlogin, obj.contactNumber]);

  }
  
  
  // fetchUserById: async (id) => {
  //   return db.query(`select * from user_register where id = '${id}'`);
  // },
  

  // setUSerStatus: async (status, id) => {
  //   return db.query(`UPDATE user_register SET status  = ? WHERE id = ?`, [
  //     status,
  //     id,
  //   ]);
  // },



    // getUserData: async () => {
  //   return db.query(`select * from user_register`);
  // },


  // checkUserInAboutFormById: async (userId) => {
  //   return db.query(
  //     "SELECT COUNT(*) AS count FROM about_you_form WHERE userId = ?",
  //     [userId]
  //   );
  // },




 
};
