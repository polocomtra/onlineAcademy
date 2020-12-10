const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid') //version 4: random
const cryptoJs = require('crypto-js');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        trim: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    }
}, { timestamps: true })

userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv4();
        this.hashed_password = cryptoJs.AES.encrypt(password, process.env.KEY_ENCRYPT).toString()
    })
    .get(function () {
        return this._password
    })

userSchema.methods = {
    authenticate: function (plainText) {
        let decrypt = cryptoJs.AES.decrypt(this.hashed_password, process.env.KEY_ENCRYPT).toString(cryptoJs.enc.Utf8);
        return plainText == decrypt;
    }
}
module.exports = mongoose.model('User', userSchema);

