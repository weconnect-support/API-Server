import Router from 'koa-router';
const router = new Router();
import version from './util/version.js';

import users from './users/index.js';
router.use('/users',users.routes());
import volunteer from './volunteer/index.js';
router.use('/volunteer',volunteer.routes());

router.get('/', (ctx) => {
	console.log('asdfasdf');
    ctx.body = 'gogogafasdfao GET ' + ctx.request.path;
});
router.use('/getVersion',version.routes());
router.get('/test',(ctx)=>{
	console.log("cccc");
	ctx.body = 'asdfsadfsaf';
});

module.exports = router;


