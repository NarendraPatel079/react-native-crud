const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
var bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [
                true,
                'Please enter name.'
            ]
        },
        username: {
            type: String,
            trim: true,
            required: [
                false,
                'Please enter user name.'
            ]
        },
        email: {
            type: String,
            trim: true,
            required: [
                true,
                'Please enter email address.'
            ],
            validate: {
                validator: function(v) {
                  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: props => `"${props.value}" is not a valid email address!`
            },
        },
        password: {
            type: String,
            minLength: [8, 'Minimum length of the password is 8'],
            required: [
                true,
                'Please enter password.'
            ]
        },
        phone: {
            type: Number,
            trim: true,
            required: [
                false,
                'Please enter contact number.'
            ]
        }
    }
);

// encode user password in `bcrypt` type
userSchema.pre("save", function(next) {
    var user = this;
    
    if (user.isModified("password")) {
        let userPassword = Buffer.from(user.password, 'base64').toString();
        if (userPassword) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(userPassword, salt, function(err, hash) {
                    if (err) {
                        next(err);
                    } else {
                        user.password = hash;
                        next();
                    }
                });
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

// Add validation for unique email address
userSchema.path('email').validate(function (value, respond) {
    return mongoose.model('users')
        .countDocuments({ email: value })
        .exec()
        .then(function (count) {
            // console.log('count', count);
            return !count;
        })
        .catch(function (err) {
            throw err;
        });
}, 'Email already exists.');

autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, 'users');
const user = mongoose.model('users', userSchema);
module.exports = user;