import Router from 'koa-router';
const users = new Router();

import login from './login.js';
users.use('/login',login.routes());

import naverCallback from './naverCallback.js';
users.use('/login/naver',naverCallback.routes());

import kakaoCallback from './kakaoCallback.js';
users.use('/login/kakao', kakaoCallback.routes());

import getUserInfo from './getUserInfo.js';
users.use('/login/naver/info', getUserInfo.routes());


users.get('/', (ctx, next) => {
    ctx.body = 'GET ' + ctx.request.path;
});

module.exports = users;

