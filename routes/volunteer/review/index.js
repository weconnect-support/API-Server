import Router from 'koa-router';
const router = new Router();

import addReview from "./addReview.js";
router.use(addReview.routes());
import getReview from "./getReview.js";
router.use(getReview.routes());
import delReview from "./delReview.js";
router.use(delReview.routes());
import updateReview from "./updateReview.js";
router.use(updateReview.routes());
module.exports = router;

