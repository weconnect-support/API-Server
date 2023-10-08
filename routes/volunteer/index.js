import Router from 'koa-router';
const router = new Router();


import getVolunteerInfo from "./getVolunteerInfo.js";
router.use(getVolunteerInfo.routes());


module.exports = router;

