import Router from 'koa-router';
const router = new Router();


import getVolunteerInfo from "./getVolunteerInfo.js";
router.use(getVolunteerInfo.routes());
import makeVolunteer from "./makeVolunteer.js";
router.use(makeVolunteer.routes());
import deleteVolunteer from "./deleteVolunteer.js";
router.use(deleteVolunteer.routes());
import updateVolunteer from "./updateVolunteer.js";
router.use(updateVolunteer.routes());
import commentIndex from "./comment/index.js";
router.use(commentIndex.routes());
module.exports = router;

