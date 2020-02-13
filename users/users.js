'use strict';

const Model = require('./user-model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let users = {} ;
users.save = async function (info){
  let search;
  if(await Model.read(info.name)){
    search =await Model.read(info.name)[0].name ;
  }
  if(!( search === info.name)){
    info.password = await bcrypt.hash(info.password , 10);
    await Model.create(info);
    return info ;
  } else {
    return info;
  }
};

users.generatorToken = async function(info){
  return await jwt.sign(info.name , 'SECRET') ;
};

users.basicAuth = async function(user , pass){
  let readDataBase = await Model.read(user);
  let ifFound = await bcrypt.compare(pass , readDataBase[0].password);
  if(ifFound){
    return readDataBase[0];
  }else{
    return Promise.reject ;
  }
};

users.showAll = async function(){
  return Model.read();
};

module.exports = users ;