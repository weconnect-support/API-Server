import Router from 'koa-router';
import {naverClientID, naverClientSecret} from "../../serverPrivacy.js";
const router = new Router();
import axios from 'axios';

router.get('/',async(ctx)=>{
	//let token = ctx.request
	var url = 'https://openapi.naver.com/v1/nid/me';
	let token = ctx.request.headers["token"];
	let res = await axios({url:url, headers:{Authorization:"Bearer "+token}});

	ctx.body=res.data;
});

module.exports = router;


