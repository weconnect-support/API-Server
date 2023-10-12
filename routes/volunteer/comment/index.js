import Router from 'koa-router';
const router = new Router();


import makeComment from "./makeComment.js";
router.use(makeComment.routes());
/*
import deleteComment from "./deleteVolunteer.js";
router.use(deleteVolunteer.routes());
import updateVolunteer from "./updateVolunteer.js";
router.use(updateVolunteer.routes());
*/
module.exports = router;

