import { fetchUserById } from "../models/user.model.js";
import { insertCategories, insertsubCategories } from "../models/admin.modal.js";
import Msg from "../helpers/message.js";


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
