const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPass = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPass = async(password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
    }
};
helpers.checkRole = (menus, id_menu) => {
    array = [];
    menus.forEach(function(data){
        array.push(data.id_menu);
    });
    let respuesta = array.indexOf(id_menu);
    if(respuesta != -1){
        return flag = true;
    }else{
        return flag = false;
    }
};

module.exports = helpers;