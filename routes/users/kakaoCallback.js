import Router from 'koa-router';
const router = new Router();
import {kakaoClientID, kakaoClientSecret, domain} from "../../serverPrivacy.js";
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
			"client_id" :kakaoClientID,
			"client_secret":kakaoClientSecret,
			"redirect_uri":"https://ss-dev.noe.systems/users/login/kakao",
			"code":ctx.query.code,
//			"scope":"profile_nickname,account_email,gender,birthday"
		}
	};
	let kakaoRes = await axios(info);
	console.log(kakaoRes.data);

	let token = kakaoRes.data.access_token;
	console.log("kakao : "+token);
	let url = 'https://kapi.kakao.com/v2/user/me?secure_resource=true';
	let res = await axios({url:url, headers:{
		Authorization:"Bearer "+token,
		'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
	}});

	ctx.body=res.data;
//	ctx.body = kakaoRes.data;
  });


module.exports = router;
