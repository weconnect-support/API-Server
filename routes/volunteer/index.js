import Router from 'koa-router';
const router = new Router();


import getVolunteerInfo from "./getVolunteerInfo.js";
router.use(getVolunteerInfo.routes());
import makeVolunteer from "./makeVolunteer.js";
router.use(makeVolunteer.routes());

module.exports = router;

