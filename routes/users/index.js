import Router from 'koa-router';
const users = new Router();

import login from './login.js';
users.use('/login',login.routes());

import join from "./join.js";
users.use("/join", join.routes());

import naverCallback from './naverCallback.js';
users.use('/login/naver',naverCallback.routes());

import kakaoCallback from './kakaoCallback.js';
users.use('/login/kakao', kakaoCallback.routes());

import googleCallback from './googleCallback.js';
users.use("/login/google",googleCallback.routes());

import getUserInfo from "./getUserInfo.js";
users.use(getUserInfo.routes());

import deleteUser from "./deleteUser.js";
users.use(deleteUser.routes());

module.exports = users;

