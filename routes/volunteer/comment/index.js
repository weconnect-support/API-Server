import Router from 'koa-router';
const router = new Router();


import makeComment from "./makeComment.js";
router.use(makeComment.routes());

import deleteComment from "./deleteComment.js";
router.use(deleteComment.routes());
import updateComment from "./updateComment.js";
router.use(updateComment.routes());

module.exports = router;

