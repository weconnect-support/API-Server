import Router from 'koa-router';
const router = new Router();
import {AppVersion, APIVersion, ReactVersion} from '../../serverPrivacy.js';
router.get('/', (ctx) => {
	ctx.body = {AppVersion : AppVersion, APIVersion : APIVersion, ReactVersion : ReactVersion};
});

module.exports = router;


