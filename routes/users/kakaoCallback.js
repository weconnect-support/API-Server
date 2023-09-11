import Router from 'koa-router';
const router = new Router();
import {client_id, client_secret} from "./kakaoAppInfo.js";
import {domain} from "./serviceURL.js"
import axios from 'axios';
var state = "RANDOM_STATE";
var redirectURI = encodeURI(domain+"/users/login/naver");
router.get('/',async(ctx)=> {
	var info = {
		url:`https://kauth.kakao.com/oauth/token`,
		headers: {'Content-type':'application/x-www-form-urlencoded;charset=utf-8'},
		method:"POST",
		data:{
			"grant_type":"authorization_code",
			"client_id" :client_id,
			"client_secret":client_secret,
			"redirect_uri":"https://ss-dev.noe.systems/users/login/kakao",
			"code":ctx.query.code,
//			"scope":"profile_nickname,account_email,gender,birthday"
		}
	};
	let kakaoRes = await axios(info);
	console.log(kakaoRes.data);
	let url = 'https://kapi.kakao.com/v2/user/me?secure_resource=true';
	let token = kakaoRes.data.access_token;
	let res = await axios({url:url, headers:{
		Authorization:"Bearer "+token,
		'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
	}});

	ctx.body=res.data;
//	ctx.body = kakaoRes.data;
  });


module.exports = router;
