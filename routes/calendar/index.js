import Router from 'koa-router';
const router = new Router();

import getSchedule from "./getSchedule.js";
router.use(getSchedule.routes());

module.exports = router;

