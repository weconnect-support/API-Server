import Router from 'koa-router';
const users = new Router();

import login from './login.js';
users.use('/login',login.routes());

import join from "./join.js";
users.use("/join", join.routes());

import getUserInfo from "./getUserInfo.js";
users.use(getUserInfo.routes());

import updateUserInfo from "./updateUserInfo.js"
users.use(updateUserInfo.routes());

import deleteUser from "./deleteUser.js";
users.use(deleteUser.routes());


module.exports = users;

