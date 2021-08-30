const userSchema = require("../model/user-schema");
const bcrypt = require('bcryptjs');

const login = async(request, response) => {
    let res = {};
    res['status'] = process.env.RESPONSE_ERROR;
    res['message'] = process.env.DEFAULT_ERROR_MESSAGE;
    res['data'] = {};
    
    try {
        //console.log(request.body);
        let userEmail = request.body.email;
        let userPassword = Buffer.from(request.body.password, 'base64').toString();
        // console.log('userEmail = ' + userEmail);
        // console.log('userPassword = ' + userPassword);
        let userInfo = await userSchema.findOne({email: userEmail});
        // console.warn('typeof userInfo = ', typeof(userInfo));
        // console.warn('userInfo = ', userInfo);
        if (userInfo) {
            //if the user is found, I mean if the user is on our database, compare the passwordFromLoginForm with the hashedPassword on our database to see if the passwords match (bcrypt will do this for us)
            if (userInfo.password) {
                const doesPasswordMatch = bcrypt.compareSync(userPassword, userInfo.password); //it wii give you a boolean, so the value of doesPasswordMatch will be a boolean
                // console.warn('doesPasswordMatch = ', doesPasswordMatch);
                //if the passwords do not match
                if (doesPasswordMatch) {
                    res['status'] = process.env.RESPONSE_SUCCESS;
                    res['message'] = `Welcome ${userInfo.name}.`;
                    res['data'] = userInfo;
                } else {
                    res['message'] = `Password did not match. Please try again.`;
                }
            } else {
                res['message'] = `Password not found.`;
            }
        } else {
            // res['message'] = "Please check your email address and password and try again.";
            res['message'] = `No account with this email address ${userEmail} found.`;
        }
    } catch(error) {
        res['message'] = error.message;
    }

    response.json(res);
}

module.exports.login = login;