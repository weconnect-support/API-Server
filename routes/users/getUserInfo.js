import Router from 'koa-router';
import {client_id, client_secret} from "./naverAppInfo.js";
const router = new Router();
import axios from 'axios';

router.get('/',(ctx)=>{
	//let token = ctx.request
	ctx.body="dev";
}

module.exports = router;


