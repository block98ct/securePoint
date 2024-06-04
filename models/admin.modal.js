import db from "../utils/db.js";


export const insertCategories = async (obj) => {
    return db.query(`insert into categories set ?`, [obj]);  
  };



  export const insertsubCategories = async (obj) => {
    return db.query(`insert into subCategories set ?`, [obj]);  
  };