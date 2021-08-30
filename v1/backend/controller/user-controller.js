const userSchema = require("../model/user-schema");

const getUsers = async(request, response) => {
    let res = {};
    res['status'] = process.env.RESPONSE_ERROR;
    res['message'] = process.env.DEFAULT_ERROR_MESSAGE;
    res['data'] = {};
    
    try {
        let allUsers = await userSchema.find();
        let totalUsers = Object.keys(allUsers).length;

        if (totalUsers) {
            res['status'] = process.env.RESPONSE_SUCCESS;
            res['message'] = `Total ${totalUsers} users records has been founded.`;
            res['data'] = allUsers;
        } else {
            res['message'] = 'Users records not found.';
        }
        
    } catch(error) {
        res['message'] = error.message;
    }

    response.json(res);
}

const addUser = async(request, response) => {
    let res = {};
    res['status'] = process.env.RESPONSE_ERROR;
    res['message'] = process.env.DEFAULT_ERROR_MESSAGE;
    res['data'] = {};

    try {
        const user = request.body;
        const newUser = new userSchema(user);

        let is_saved = await newUser.save();
        // console.log('addUser', is_saved);
        if (is_saved) {
            res['status'] = process.env.RESPONSE_SUCCESS;
            res['message'] = "User information has been added successfully.";
            res['data'] = newUser;
        } else {
            res['message'] = "User information could not be added. Please try again.";
        }
    } catch(error) {
        res['message'] = error.message;
    }
    response.json(res);
}

const getUserById = async(request, response) => {
    let res = {};
    res['status'] = process.env.RESPONSE_ERROR;
    res['message'] = process.env.DEFAULT_ERROR_MESSAGE;
    res['data'] = {};

    try {
        //console.log(request.params);
        const id = request.params.id;
        let userInfo = await userSchema.findById(id);
        
        if (userInfo) {
            res['status'] = process.env.RESPONSE_SUCCESS;
            res['message'] = "User information has been founed successfully.";
            res['data'] = userInfo;
        } else {
            res['message'] = "User information could not be founed. Please try again.";
        }
    } catch(error) {
        res['message'] = error.message;
    }
    response.json(res);
}

const editUser = async(request, response) => {
    let res = {};
    res['status'] = process.env.RESPONSE_ERROR;
    res['message'] = process.env.DEFAULT_ERROR_MESSAGE;
    res['data'] = {};

    try {
        const user = request.body;
        const editUser = new userSchema(user);
        const id = request.params.id;
        let is_updated = await userSchema.updateOne({_id: id}, editUser);
        //console.log("is_updated");
        //console.log(is_updated);
        
        if (is_updated) {
            res['status'] = process.env.RESPONSE_SUCCESS;
            res['message'] = "User information has been updated successfully.";
            res['data'] = editUser;
        } else {
            res['message'] = "User information could not be updated. Please try again.";
        }
    } catch(error) {
        res['message'] = error.message;
    }
    response.json(res);
}

const deleteUser = async(request, response) => {
    let res = {};
    res['status'] = process.env.RESPONSE_ERROR;
    res['message'] = process.env.DEFAULT_ERROR_MESSAGE;
    res['data'] = {};

    try {
        const id = request.params.id;
        let deleteUser = await userSchema.deleteOne({_id: id});
        //console.log("deleteUser");
        //console.log(deleteUser);

        if (deleteUser) {
            res['status'] = process.env.RESPONSE_SUCCESS;
            res['message'] = "User information has been deleted successfully.";
            res['data'] = deleteUser;
        } else {
            res['message'] = "User information could not be deleted. Please try again.";
        }
    } catch(error) {
        res['message'] = error.message;
    }
    response.json(res);
}

module.exports.getUsers = getUsers;
module.exports.addUser = addUser;
module.exports.getUserById = getUserById;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;