import Router from 'koa-router';
const router = new Router();
import {client_id, client_secret} from "./naverAppInfo.js";
import axios from 'axios';
var state = "RANDOM_STATE";
var redirectURI = encodeURI("https://ss.noe.systems/users/login/naver");
router.get('/',async(ctx)=> {
	var info = {
	url:`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${ctx.query.code}&state=${state}`,
		headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
	};
	let naverRes = await axios(info);
	let url = 'https://openapi.naver.com/v1/nid/me';
	let token = naverRes.data.access_token;
	let res = await axios({url:url, headers:{Authorization:"Bearer "+token}});

	ctx.body=res.data;

//	ctx.body = naverRes.data;
  });


module.exports = router;
