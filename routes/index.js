import Router from 'koa-router';
const router = new Router();
import version from './util/version.js';

import users from './users/index.js';
router.use('/users',users.routes());
import volunteer from './volunteer/index.js';
router.use('/volunteer',volunteer.routes());

router.get('/', (ctx) => {
    ctx.body = `ssangsang API SERVER`;
});
router.use('/getVersion',version.routes());

module.exports = router;


