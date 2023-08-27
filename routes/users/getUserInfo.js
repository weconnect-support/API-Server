import Router from 'koa-router';
import {client_id, client_secret} from "./naverAppInfo.js";
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


