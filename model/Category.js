const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid') //version 4: random
const cryptoJs = require('crypto-js');

const categorySchema = new mongoose.Schema({
    Category_ID: {
        type: String,
        unique: true
    },
    Category_Name: {
        type: String,
    }
}, {collection: 'Category'})

const categoryModel = mongoose.model('Category', categorySchema);

categoryModel.create(
        {Category_ID:'Cat01', Category_Name:'Web'},
        {Category_ID:'Cat02', Category_Name:'Mobile'});

module.exports = mongoose.model('Category', categorySchema);


