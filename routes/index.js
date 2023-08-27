import Router from 'koa-router';
const router = new Router();

import users from './users/index.js';
router.use('/users',users.routes());
console.log("hehe");
router.get('/', (ctx) => {
	console.log('asdfasdf');
    ctx.body = 'gogogafasdfao GET ' + ctx.request.path;
});
router.get('/test',(ctx)=>{
	console.log("cccc");
	ctx.body = 'asdfsadfsaf';
});

module.exports = router;


