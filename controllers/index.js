const userController = require('./userController');


// Create an object to hold references to userController and adminController and subAdminController
const controller = {
    userController: userController,
    // adminController: adminController,
    // superAdminController: superAdminController
    // subAdminController:subAdminController
};

module.exports = controller;  
