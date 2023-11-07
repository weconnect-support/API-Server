import Router from 'koa-router';
const router = new Router();

import addReview from "./addReview.js";
router.use(addReview.routes());
import getReview from "./getReview.js";
router.use(getReview.routes());
module.exports = router;

