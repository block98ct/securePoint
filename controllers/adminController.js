import {
   fetchUserById,
   fetchAllUsers,
   fetchAllUsersDesc,
   allUsersCount,
   getCategoriesList
   
   } from "../models/user.model.js";
import { 
  insertCategories, 
  insertsubCategories } from "../models/admin.modal.js";

import Msg from "../helpers/message.js";
import { base_url } from "../config.js";



const checkIsAdmin = async (req, res) => {
  const { userId } = req.decoded;

  const adminResp = await fetchUserById(userId);

  if (adminResp[0].roll !== "admin") {
    return res
      .status(201)
      .json({ success: false, message: "you are not authorized" });
  }
};

export const addSubCategories = async (req, res) => {
    try {
      await checkIsAdmin(req, res)
      const {subCategoryName, categoryId} = req.body;
      let obj={
        subCategory: subCategoryName,
        categoryId
      }
      try {
        
        await insertsubCategories(obj)
      } catch (error) {
        console.log(error);
        
      }
      return res.status(200).send({
        success: true,
        message: `subCategory added successfully`

       
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
  }
};

export const addCategories = async (req, res) => {
  await checkIsAdmin(req, res);
  try {
    const { categoryName, categoryImage } = req.body;
    const imgPath = req.file.filename;
    let obj = {
      categoryName,
      categoryImage: imgPath,
    };

    await insertCategories(obj);
    return res.status(200).send({
      success: true,
      message: 'Category added successfully'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
  }
};


export const getAllUsers = async(req, res)=>{
  try {
    await checkIsAdmin(req, res);
    const users = await fetchAllUsers()
    const count = await allUsersCount()
    console.log(count)
    const resp = users.map((item)=>{
      const {id, name , createdAt, contactNumber, dp} = item;
      return {
        id,
        name,
        joinedAt: new Date(createdAt).toLocaleDateString().replace(/\//g, '-'),
        contactNumber,
        dp: dp? `${base_url}/temp/${dp}`: null
      }
    })


    return res.status(200).send({
      success: true,
      message: 'All Users data',
      totalUsers: count[0].totalUsers,
      data: resp
    });

    
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
    
  }
}


export const getAllLatestUsers = async(req, res)=>{
  try {
    await checkIsAdmin(req, res);
    const users = await fetchAllUsersDesc()
    const resp = users.slice(0, 5).map((item)=>{
      const {id, name , createdAt, contactNumber, dp} = item;
      return {
        id,
        name,
        joinedAt: new Date(createdAt).toLocaleDateString().replace(/\//g, '-'),
        contactNumber,
        dp: dp? `${base_url}/temp/${dp}`: null
      }
    })


    return res.status(200).send({
      success: true,
      message: 'All latest Users',
      data: resp
    });

    
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: Msg.err,
    });
    
  }
}



export const getAllCategoryList = async (req, res) => {
  try {
    await checkIsAdmin(req, res)
    const resp = await getCategoriesList();
    const filteredResp = resp.map(({ id, categoryName, categoryImage}) => ({
      id,
      categoryName,
      categoryImage: categoryImage? `${base_url}/temp/${categoryImage}`: null
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



