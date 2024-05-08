const { hashPassword, generateRandomString, generateRandomPassword } = require("../helpers/middleware");

const {
  fetchAdminById,
  adminRegister,
  fetchAdminByEmail,
  setAdminStatus,
  getAdminData,
  getLogsData,
  addLogs
} = require("../models/admin.modal");
const { fetchUserByEmail, setUSerStatus,getUserData, userRegister } = require("../models/user.model");
const Msg = require("../helpers/message");
const { mail} = require("../helpers/emailPassword")

const checkSuperAdmin = async(req)=>{
  const { adminId } = req.decoded;
  const adminResp = await fetchAdminById(adminId);
  
  if (adminResp[0].roll !== "superAdmin") {
    return res
    .status(201)
    .json({ success: false, message: "you are not authorized" });
  }

} 
exports.resgisterAdmins = async (req, res) => {
  try {
    
    await checkSuperAdmin(req)
    const { name, email, password, confirmPassword, contactNo } = req.body;
    const { adminId } = req.decoded;
    const adminResp = await fetchAdminById(adminId);


    const checkEmail = await fetchAdminByEmail(email);



    if ((!name || !email || !password || !confirmPassword, !contactNo)) {
      return res
        .status(201)
        .json({ success: false, message: Msg.invalidCread });
    }

    if (checkEmail.length > 0) {
      return res.status(201).send({
        success: false,
        msg: Msg.emailExists
      });
    }

    if (password !== confirmPassword) {
      return res.status(201).json({ success: false, message: Msg.pwdNotMatch });
    }

    const Password = await hashPassword(password);

    const adminObj = {
      name,
      email,
      password: Password,
      contactNo
    };
    await adminRegister(adminObj);
    
    let logObj={
      name: adminResp[0].name,
      authority: adminResp[0].roll,
      effectedData: "resgister new admin",
      timestamp: new Date(),
      action: "created"

    }
    // adding logs
    await addLogs(logObj)
 

    return res.status(200).json({ success: true, message: Msg.adminRegister });
  } catch (error) {
    console.log(error);
    return res.status(201).send({
      success: false,
      msg: error
    });
  }
};


exports.regitserUsers= async(req, res)=>{
  try {
    const { adminId } = req.decoded;
    const adminResp = await fetchAdminById(adminId);
    await checkSuperAdmin(req)
    const { name, email,  contactNo } = req.body;
    

    const checkEmail = await fetchUserByEmail(email);
    const password = await generateRandomPassword(8)
    const actToken = await generateRandomString(8)

    if ((!name || !email || !contactNo)) {
      return res
        .status(201)
        .json({ success: false, message: Msg.invalidCread });
    }
    
    if (checkEmail.length > 0) {
      return res.status(201).send({
        success: false,
        msg: Msg.emailExists
      });
    }


    const Password = await hashPassword(password);

    const adminObj = {
      name,
      email,
      password: Password,
      isVerified: 1,
      contactNumber: contactNo,
      actToken
    };

    await mail(email, password)
    await userRegister(adminObj);

    let logObj={
      name: adminResp[0].name,
      authority: adminResp[0].roll,
      effectedData: "resgister new users",
      timestamp: new Date(),
      action: "created"

    }
    // adding logs
    await addLogs(logObj)
    
    return res.status(200).json({ success: true, message: Msg.adminRegister });

    
  } catch (error) {
    console.log(error);
    return res.status(201).send({
      success: false,
      msg: error
    });
    

    
  }

}

exports.setStatusOfAdmins = async (req, res) => {
  try {
    // const { status, id} = req.query
    // const { adminId } = req.decoded;

    // const adminResp = await fetchAdminById(adminId);

    // if (adminResp[0].roll !== "superAdmin") {
    //   return res
    //     .status(201)
    //     .json({ success: false, message: "you are not authorized" });
    // }

    // await setAdminStatus(status, id)

    // return res
    //     .status(200)
    //     .json({ success: true, message: Msg.ppeRequestUpdated });
    await checkSuperAdmin(req)
    const { status, id, roll } = req.body;

    if (roll == "user") {
      await setUSerStatus(status, id);
      return res
        .status(200)
        .json({ success: true, message: Msg.ppeRequestUpdated });
    }

    await setAdminStatus(status, id);
    return res
      .status(200)
      .json({ success: true, message: Msg.ppeRequestUpdated });
  } catch (error) {
    console.log(error);
    return res.status(201).send({
      success: false,
      msg: error
    });
  }
};

exports.allAdminsData = async(req, res)=>{
  try {
    await checkSuperAdmin(req,res)
          const resp = await getAdminData()
          const filteredAdmins = resp.filter(admin => admin.roll === "admin");

          // Map filtered admins to the desired format
          const formattedData = filteredAdmins.map(admin => ({
              name: admin.name,
              roll: admin.roll,
              email: admin.email,
              contactNo: admin.contactNo,
              lastLogin: admin.lastLogin,
              status: admin.status
          }));
  
          console.log(formattedData);
          return res.status(200).json({ success: true, data: formattedData });

    
  } catch (error) {
    console.log(error);
    return res.status(201).send({
      success: false,
      msg: error
    });
    
  }
}

exports.allUserData =async(req, res)=>{
    try {
       
        await checkSuperAdmin(req)
        const userData = await getUserData()
        const formattedUserData = userData.map(user => ({
            id: user.id,
            name: user.name === null ? "": user.name,
            roll: user.roll,
            email: user.email,
            contactNo: user.contactNumber ,
            lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : null,
            status: user.status
        }));

        return res.status(200).json({ success: true, data: formattedUserData });
        
        
    } catch (error) {
        console.log(error);
        return res.status(201).send({
          success: false,
          msg: error
        });
        
    }
}


exports.searchUserByData = async(req, res)=>{
  try {
     await checkSuperAdmin(req)
     const { name, email, contactNo, status } = req.query;

     const userData = await getUserData();

      const filteredUserData = userData.filter(user => {
      const userName = user.name ? user.name.toLowerCase() : "";

      const userEmail = user.email.toLowerCase();

      const userContactNo = user.contactNumber ? user.contactNumber.toLowerCase() : "";
      const userStatus = user.status.toString();


      const nameMatch = name ? userName.includes(name.toLowerCase()) : true;
      const emailMatch = email ? userEmail.includes(email.toLowerCase()) : true;
      const contactNoMatch = contactNo ? userContactNo.includes(contactNo.toLowerCase()) : true;
      const statusMatch = status ? userStatus === status.toString() : true;

      return nameMatch && emailMatch && contactNoMatch && statusMatch;
    });

    const formattedUserData = filteredUserData.map(user => ({
      id: user.id,
      name: user.name === null ? "" : user.name,
      roll: user.roll,
      email: user.email,
      contactNo: user.contactNumber,
      lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : null,
      status: user.status
    }));

    return res.status(200).json({ success: true, data: formattedUserData });

    
  } catch (error) {
    console.log(error)
    return res.status(201).send({
      success: false,
      msg: error
    });
  }
}


// exports.sortUserByDate= async(req, res)=>{
//   try {
//     await checkSuperAdmin(req)
    
//   } catch (error) {
//     return res.status(201).send({
//       status: false,
//       msg: error
//     });
    
//   }
// }



exports.searchAdminByData = async(req, res)=>{
  try {
    await checkSuperAdmin(req)
    try {
      await checkSuperAdmin(req)
      const { name, email, contactNo, status } = req.query;
 
      const userData = await getAdminData();
 
       const filteredUserData = userData.filter(user => {
       const userName = user.name ? user.name.toLowerCase() : "";
 
       const userEmail = user.email.toLowerCase();
 
       const userContactNo = user.contactNo ? user.contactNo.toLowerCase() : "";
       const userStatus = user.status.toString();
 
 
       const nameMatch = name ? userName.includes(name.toLowerCase()) : true;
       const emailMatch = email ? userEmail.includes(email.toLowerCase()) : true;
       const contactNoMatch = contactNo ? userContactNo.includes(contactNo.toLowerCase()) : true;
       const statusMatch = status ? userStatus === status.toString() : true;
 
       return nameMatch && emailMatch && contactNoMatch && statusMatch;
     });
 
     const formattedUserData = filteredUserData.map(user => ({
       id: user.id,
       name: user.name === null ? "" : user.name,
       roll: user.roll,
       email: user.email,
       contactNo: user.contactNo,
       lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : null,
       status: user.status
     }));
 
     return res.status(200).json({ success: true, data: formattedUserData });
 
     
   } catch (error) {
     console.log(error)
     return res.status(201).send({
       status: false,
       msg: error
     });
   }
    
  } catch (error) {
    console.log(error)
    return res.status(201).send({
      status: false,
      msg: error
    });
  }
}


// exports.sortAdminByDate= async(req, res)=>{
//   try {
//     await checkSuperAdmin(req)
    
//   } catch (error) {
//     return res.status(201).send({
//       status: false,
//       msg: error
//     });
    
//   }
// }



let logId = 1300;
exports.allLogs= async(req,res)=>{
  try {
    await checkSuperAdmin(req)
    const logsResponse = await getLogsData()
    const formattedData = await logsResponse.map((item, index)=>{
      return {
        id:item.id,
        logiId:logId+index,
        name: item.name,
        authority: item.authority,
        effectedData: item.effectedData,
        timestamp: (item.timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        action: item.action
      }
    })

    
    return res.status(200).json({ success: true, data: formattedData });

  } catch (error) {
    console.log(error)
      return res.status(201).send({
      status: false,
      msg: error
    });
  }

}




