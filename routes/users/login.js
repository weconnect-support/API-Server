import Router from 'koa-router';
const router = new Router();
import {google} from 'googleapis'
import {naverClientID, naverClientSecret, client, connection, jwtKey,domain,googleClientID, googleClientSecret, kakaoClientID, kakaoClientSecret} from '../../serverPrivacy.js';
import knex from 'knex';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import axios from 'axios';
const conn = knex({client:client, connection:connection})
var state = "RANDOM_STATE";
var redirectURI = encodeURI(domain+"/users/login/naver");
var api_url = "";
//google authorization url
const oauth2Client = new google.auth.OAuth2(
	googleClientID,
	googleClientSecret,
	domain+"/users/login/google"
);
const scopes = [
	"https://www.googleapis.com/auth/userinfo.profile",//
	"https://www.googleapis.com/auth/user.phonenumbers.read",
	"email",
	"profile",
	'phone'
];
const authorizationUrl = oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes,
	include_granted_scopes: true
});

router.get('/', (ctx)=> {
	api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientID}&redirect_uri=${redirectURI}&state=${state}`;
	let kakaourl = "https://kauth.kakao.com/oauth/authorize?client_id=eb14cc7280926662ac5976efbbe3943a&redirect_uri=https://ss-dev.noe.systems/users/login/kakao&response_type=code&scope=profile_nickname,account_email,gender,birthday"
	ctx.body = "<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a><br><h3>"+authorizationUrl+"</h3><br>"+kakaourl;
	
});
const accountCheck = async(email, platform)=>{
	let signupCheck = await conn("users").select().where({email : email, platform : platform, is_delete:0})
	if(signupCheck.length == 0)
		return {"code":0};
	else
		return {"code":1, "data":signupCheck[0]};
}

router.post('/',async(ctx)=>{	
	console.log(ctx.request.body)
	const {platform} =  ctx.request.body;
	if(platform == undefined || (platform >= 5 || platform <= 0)){
		/*
		console.log(platform);
		console.log(platform == undefined);
		console.log(platform >= 5);
		console.log(platform <= 0);
		*/
		ctx.body = {"status":"no", "code":-1, "text":"platform not found"};
	}
	else if(platform == 4){
		const {email, password} = ctx.request.body;
		let userCheck = await conn("users").select().where({email:email, password:crypto.createHash('sha512').update(password).digest('hex'), is_delete: 0});
		if(userCheck.length == 1){
			let {idx, email,nickname}  = userCheck[0];
			let token = jwt.sign({"idx":idx,"nickname":nickname,"expire":new Date()}, jwtKey);
			ctx.body = {"status":"ok","code":1,"userinfo": userCheck[0],token:token,"text":"login_success"}
		}
		else{
			ctx.body = {"status":"no","code":2,"text":"login_fail"}
		}
	}
	else{
		const {access_token} = ctx.request.body;
		let email = "";
		if(!access_token){
			ctx.body = {"status":"no","code":-1 ,"text": "parameter validation check error"};
			return;
		}
		if(platform == 1){//google
			try{
				const data = await axios({
					url:`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
				})

				email = data.data.email;
			}
			catch(err){
				ctx.body = {"status":"no", "code":3,"text":"access_token_err"};
				return;
			}
		}
		else if(platform == 2){//kakao
			try{
				const data = await axios({
					url:'https://kapi.kakao.com/v2/user/me?secure_resource=true',
					headers:{
						'Authorization':`Bearer ${access_token}`,
						'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
					}
				});
				email = data.data.kakao_account.email;
			}
			catch(err){
				ctx.body = {"status":"no", "code":3,"text":"access_token_err"};
				return
			}
		}
		else{//naver
			//console.log("naver.")
			try{
				const data = await axios({
					url :'https://openapi.naver.com/v1/nid/me',
					headers:{
						"Authorization":`Bearer ${access_token}`
					}
				});
				//console.log("ddddddnnn");
				//console.log(data.data.response)
				email = data.data.response.email;
			}
			catch(err){
				console.log(err)
				ctx.body = {"status":"no", "code":3,"text":"access_token_err"};
				return;
			}
		}

		let userInfo = await accountCheck(email,platform);
		if(userInfo.code){ // login sucess
			ctx.body = {"status":"ok", "code":1,"text":"login_success", "data":userInfo.data};
		}
		else{//login fail		
			ctx.body = {"status":"no","code":1, "test": "non dev"}
		}
	}

})
module.exports = router;
