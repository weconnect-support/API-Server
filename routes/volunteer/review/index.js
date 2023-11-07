import Router from 'koa-router';
const router = new Router();

import addReview from "./addReview.js";
router.use(addReview.routes());

module.exports = router;

